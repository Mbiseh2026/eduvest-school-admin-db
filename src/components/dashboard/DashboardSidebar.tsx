import { useState } from "react";
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
  Wallet,
  X,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/eduvest/Logo";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/use-role";
import type { Permission } from "@/lib/eduvest/roles";

type NavChild = { to: string; label: string; permission?: Permission };
type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  permission?: Permission;
  children?: NavChild[];
};

export const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true, permission: "dashboard.view" },
  {
    to: "/dashboard/attendance",
    label: "Attendance",
    icon: CalendarCheck,
    permission: "attendance.view",
    children: [
      { to: "/dashboard/attendance?view=class", label: "Class Roll Call" },
      { to: "/dashboard/attendance?view=gate", label: "Gate Attendance" },
    ],
  },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare, permission: "messages.view" },
  {
    to: "/dashboard/finance",
    label: "Finance",
    icon: PiggyBank,
    permission: "finance.view",
    children: [
      { to: "/dashboard/finance", label: "Overview" },
      { to: "/dashboard/income", label: "Income" },
      { to: "/dashboard/expenditure", label: "Expenditure" },
    ],
  },
  {
    to: "/dashboard/students",
    label: "Students",
    icon: GraduationCap,
    permission: "students.view",
    children: [
      { to: "/dashboard/students", label: "Student list" },
      { to: "/dashboard/admissions", label: "Admissions" },
    ],
  },
  { to: "/dashboard/parents", label: "Parents", icon: Users, permission: "parents.view" },
  {
    to: "/dashboard/teachers",
    label: "Teachers & HR",
    icon: UserCog,
    permission: "teachers.view",
    children: [
      { to: "/dashboard/teachers", label: "Teacher Management" },
      { to: "/dashboard/payroll", label: "Payroll", permission: "payroll.view" },
    ],
  },
  { to: "/dashboard/timetable", label: "Timetable", icon: CalendarRange, permission: "timetable.view" },
  { to: "/dashboard/reports", label: "Reports", icon: FileBarChart, permission: "reports.view" },
  { to: "/dashboard/digital-id", label: "Digital ID", icon: IdCard, permission: "digital-id.view" },
  { to: "/dashboard/ai", label: "AI Insights", icon: Sparkles, permission: "ai.dashboard" },
  { to: "/dashboard/settings", label: "School Settings", icon: Settings, permission: "settings.view" },
];

// Keep an explicit reference so unused-import linting doesn't strip Wallet.
export const PAYROLL_ICON = Wallet;

export function DashboardSidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { can } = useRole();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  const visibleItems = NAV_ITEMS.filter((i) => !i.permission || can(i.permission));

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
            {visibleItems.map((item) => {
              const active = isActive(item.to, item.exact);
              const Icon = item.icon;
              const childMatches = item.children?.some((c) => isActive(c.to)) || false;
              const groupActive = active || childMatches;
              const expanded = openGroups[item.to] ?? groupActive;
              const visibleChildren = item.children?.filter(
                (c) => !c.permission || can(c.permission),
              );
              const hasChildren = !!visibleChildren?.length;

              return (
                <li key={item.to}>
                  <div className="flex items-center gap-1">
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className={cn(
                        "group flex flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        groupActive
                          ? "bg-primary-soft text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          groupActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      {item.label}
                    </Link>
                    {hasChildren && (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenGroups((s) => ({ ...s, [item.to]: !expanded }))
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
                        aria-label="Toggle group"
                      >
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform", expanded ? "rotate-180" : "")}
                        />
                      </button>
                    )}
                  </div>
                  {hasChildren && expanded && (
                    <ul className="mt-1 space-y-0.5 border-l border-border pl-4 ml-5">
                      {visibleChildren!.map((child) => {
                        const [childPath, childQuery] = child.to.split("?");
                        const childSearch = childQuery
                          ? Object.fromEntries(new URLSearchParams(childQuery))
                          : undefined;
                        const childActive = childSearch
                          ? pathname === childPath &&
                            Object.entries(childSearch).every(
                              ([k, v]) => new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get(k) === v,
                            )
                          : isActive(child.to);
                        return (
                          <li key={child.to}>
                            <Link
                              to={childPath}
                              search={childSearch as never}
                              onClick={onClose}
                              className={cn(
                                "flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                                childActive
                                  ? "bg-primary-soft/60 text-primary"
                                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
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
