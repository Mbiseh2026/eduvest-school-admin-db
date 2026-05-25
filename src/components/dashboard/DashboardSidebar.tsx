import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  PiggyBank,
  GraduationCap,
  Users,
  UserCog,
  CalendarRange,
  FileBarChart,
  IdCard,
  Sparkles,
  Settings,
  X,
} from "lucide-react";
import { Logo } from "@/components/eduvest/Logo";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/finance", label: "Finance", icon: PiggyBank },
  { to: "/dashboard/students", label: "Students", icon: GraduationCap },
  { to: "/dashboard/parents", label: "Parents", icon: Users },
  { to: "/dashboard/teachers", label: "Teachers & HR", icon: UserCog },
  { to: "/dashboard/timetable", label: "Timetable", icon: CalendarRange },
  { to: "/dashboard/reports", label: "Reports", icon: FileBarChart },
  { to: "/dashboard/digital-id", label: "Digital ID", icon: IdCard },
  { to: "/dashboard/ai", label: "AI Insights", icon: Sparkles },
  { to: "/dashboard/settings", label: "School Settings", icon: Settings },
] as const;

export function DashboardSidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <Logo />
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.to, "exact" in item ? item.exact : false);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary-soft text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4.5 w-4.5 shrink-0",
                        active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                      )}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-border p-4">
          <div className="rounded-xl bg-gradient-navy p-4 text-navy-foreground">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-80">
              <Sparkles className="h-3.5 w-3.5" />
              AI Coming soon
            </div>
            <p className="mt-2 text-sm opacity-90">
              Dashboard AI will surface attendance and finance insights automatically.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
