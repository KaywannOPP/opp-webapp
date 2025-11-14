import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import { Sidebar } from '@/components/navigation/sidebar';
import { getCurrentUserInfo } from '@/lib/current-user';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // ✅ Auth guard (server-side)
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const info = await getCurrentUserInfo();

    return (
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-[240px_1fr]">
            <aside className="border-r bg-background">
                <Sidebar />
            </aside>

            <main className="flex flex-col ">
                {/* Top bar */}
                <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="mx-auto flex h-14 items-center justify-between px-4">
                        {/* Left: Team logo + name */}
                        <div className="flex items-center gap-3">
                            {info?.teamLogoUrl ? (
                                <Image
                                    src={info.teamLogoUrl}
                                    alt={info?.teamName ?? 'Team'}
                                    width={24}
                                    height={24}
                                    className="rounded"
                                />
                            ) : (
                                <div className="size-6 rounded bg-foreground/10" />
                            )}
                            <div className="text-sm font-medium">{info?.teamName ?? 'Team'}</div>
                        </div>

                        {/* Center: Greeting */}
                        <div className="absolute left-1/2 -translate-x-1/2">
                            <h1 className="text-sm md:text-base font-semibold">
                                {info?.firstName
                                    ? `Welcome, ${info.firstName}`
                                    : info?.fullName
                                    ? `Welcome, ${info.fullName}`
                                    : 'Welcome'}
                            </h1>
                        </div>

                        {/* Right: actions placeholder */}
                        <div className="flex items-center gap-2" />
                    </div>
                </div>

                <div className="flex-1 w-full mx-auto max-w-6xl px-4 py-6">{children}</div>
            </main>
        </div>
    );
}
