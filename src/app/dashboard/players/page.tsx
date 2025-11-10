// src/app/dashboard/players/page.tsx
import { getCurrentUserInfo } from "@/lib/current-user";
import { createClient } from "@/utils/supabase/server";
import { DataTable } from "@/components/data-table";
import { columns, Player } from "./columns";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

type RowJoined = {
  roles: string[] | null;
  profiles: Profile | Profile[] | null;
};

function publicStorageUrl(
  objectName: string | null | undefined,
  bucket: string
) {
  if (!objectName) return null;
  if (/^https?:\/\//i.test(objectName)) return objectName;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${bucket}/${objectName}`;
}

const AVATAR_BUCKET = "AVATARS";

function firstOrNull<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default async function PlayersPage() {
  const info = await getCurrentUserInfo();
  const supabase = await createClient();

  if (!info?.teamId) {
    return (
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Players</h2>
        <p className="text-sm text-muted-foreground">
          No team found for your account yet.
        </p>
      </div>
    );
  }

  // Scope to the active team to avoid duplicates
  const { data, error } = await supabase
    .from("team_members")
    .select("roles, profiles(id, first_name, last_name, email, avatar_url)")
    .eq("team", info.teamId)
    .limit(200);

  if (error) {
    return (
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Players</h2>
        <p className="text-sm text-red-600">
          Failed to load players: {error.message}
        </p>
      </div>
    );
  }

  const rows = (data ?? []) as RowJoined[];

  const players: Player[] = rows
    .map((row) => {
      const p = firstOrNull(row.profiles);
      if (!p) return null;

      const name =
        [p.first_name ?? "", p.last_name ?? ""].join(" ").trim() ||
        p.email ||
        "Unknown";

      const initials = (
        name
          .split(" ")
          .map((s) => s[0])
          .filter(Boolean)
          .slice(0, 2)
          .join("") || "U"
      ).toUpperCase();

      return {
        id: p.id,
        name,
        email: p.email ?? "",
        avatar: publicStorageUrl(p.avatar_url, AVATAR_BUCKET),
        initials,
        roles: row.roles ?? [],
      };
    })
    .filter(Boolean) as Player[];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Players</h2>
        <p className="text-sm text-muted-foreground">
          {info.teamName ?? "Team"} — {players.length} member
          {players.length === 1 ? "" : "s"}
        </p>
      </div>

      {/* shadcn DataTable with simple search on "name" */}
      <DataTable columns={columns} data={players} searchColumn="name" />
    </div>
  );
}
