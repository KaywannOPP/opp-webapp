import { createClient } from "@/utils/supabase/server";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-semibold">Welcome to your Dashboard</h1>
      {user && (
        <div className="text-center">
          <p className="text-gray-600">Signed in as</p>
          <p className="font-medium">{user.email}</p>
        </div>
      )}
      <SignOutButton />
    </main>
  );
}
