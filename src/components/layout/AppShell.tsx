import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  LayoutDashboard,
  LogOut,
  Receipt,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { DEMO_MODE } from "@/lib/api-client";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/groups", label: "Groups", icon: UsersRound },
  { to: "/friends", label: "Friends", icon: Users },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/profile", label: "Profile", icon: UserRound },
] as const;

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Receipt className="size-5" />
          </span>
          <span className="text-lg font-semibold text-sidebar-foreground">Splitwise</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        {DEMO_MODE && (
          <p className="rounded-lg bg-accent px-3 py-2 text-xs text-accent-foreground">
            Demo data mode — connect your backend URL to use live data.
          </p>
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-4 md:px-8">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await logout();
              navigate({ to: "/auth" });
            }}
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
