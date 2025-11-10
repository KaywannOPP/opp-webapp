"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, CalendarDays, Settings } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Players", href: "/dashboard/players", icon: Users },
  { label: "Sessions", href: "/dashboard/sessions", icon: CalendarDays },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Brand / Logo area */}
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="inline-flex items-center gap-2">
          <div className="size-6 rounded bg-foreground/10" />
          <span className="text-sm font-semibold">On Pitch Performance</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer slot (e.g., sign out, version) */}
      <div className="border-t p-2 text-xs text-muted-foreground">
        <p>v0.1.0</p>
      </div>
    </div>
  );
}
