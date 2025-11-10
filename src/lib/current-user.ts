import { createClient } from "@/utils/supabase/server";

export type CurrentUserInfo = {
  userId: string;
  email: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  teamId: string | null;
  teamName: string | null;
  teamLogoUrl: string | null;
};

const AVATAR_BUCKET = "AVATARS";
const TEAM_IMAGES_BUCKET = "TEAMS";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

type Team = {
  id: string;
  name: string | null;
  image_url: string | null;
  owner: string | null;
};

type TeamJoined = {
  teams: Team | Team[] | null;
};

/** Build a public URL for a storage object name (path) in a public bucket */
function publicStorageUrl(
  objectName: string | null | undefined,
  bucket: string
): string | null {
  if (!objectName) return null;
  if (/^https?:\/\//i.test(objectName)) return objectName;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${bucket}/${objectName}`;
}

/** Normalize joined `teams` which may be an object, array, or null */
function getFirstTeam(joined: Team | Team[] | null | undefined): Team | null {
  if (!joined) return null;
  return Array.isArray(joined) ? joined[0] ?? null : joined;
}

export async function getCurrentUserInfo(): Promise<CurrentUserInfo | null> {
  const supabase = await createClient();

  // 1) Auth user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // 2) Profile
  const { data: profileRow } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const profile = (profileRow ?? null) as Profile | null;
  const firstName = profile?.first_name ?? null;
  const lastName = profile?.last_name ?? null;
  const fullName = [firstName ?? "", lastName ?? ""].join(" ").trim() || null;

  // 3) Resolve team (prefer owned, else first membership)
  let teamId: string | null = null;
  let teamName: string | null = null;
  let teamLogoUrl: string | null = null;

  // A) Prefer a team user owns
  {
    const { data: ownedData } = await supabase
      .from("team_members")
      .select("teams(id, name, image_url, owner)")
      .eq("profile", user.id)
      .limit(10);

    const owned = (ownedData ?? []) as TeamJoined[];
    const preferred = getFirstTeam(
      owned.find((tm) => getFirstTeam(tm.teams)?.owner === user.id)?.teams
    );

    if (preferred) {
      teamId = preferred.id;
      teamName = preferred.name ?? null;
      teamLogoUrl = publicStorageUrl(
        preferred.image_url ?? null,
        TEAM_IMAGES_BUCKET
      );
    }
  }

  // B) Otherwise, first membership team
  if (!teamId) {
    const { data: memberData } = await supabase
      .from("team_members")
      .select("teams(id, name, image_url)")
      .eq("profile", user.id)
      .limit(1)
      .maybeSingle();

    const member = (memberData ?? null) as TeamJoined | null;
    const firstTeam = getFirstTeam(member?.teams);
    if (firstTeam) {
      teamId = firstTeam.id;
      teamName = firstTeam.name ?? null;
      teamLogoUrl = publicStorageUrl(
        firstTeam.image_url ?? null,
        TEAM_IMAGES_BUCKET
      );
    }
  }

  return {
    userId: user.id,
    email: profile?.email ?? user.email ?? null,
    fullName,
    firstName,
    lastName,
    teamId,
    teamName,
    teamLogoUrl,
  };
}
