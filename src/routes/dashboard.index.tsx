import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Users,
  UserCog,
  CalendarCheck,
  Wallet,
  TrendingUp,
  MessageSquare,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/PageHeader";
import { useWorkspace } from "@/hooks/use-workspace";
import { ATTENDANCE_TODAY, TRANSACTIONS, MESSAGES } from "@/lib/eduvest/dashboard-mock";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Overview — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: DashboardHome,
});

function DashboardHome() {
  const { workspace } = useWorkspace();
  const isAll = workspace === "All School";

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good morning, ${workspace}`}
        description={
          isAll
            ? "Aggregate view across every section of your school."
            : `Executive overview for ${workspace}.`
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Total Students" value={isAll ? "457" : "182"} hint="+12 this week" icon={GraduationCap} tone="primary" />
        <StatCard label="Total Parents" value={isAll ? "389" : "154"} hint="98% reachable" icon={Users} tone="navy" />
        <StatCard label="Total Teachers" value={isAll ? "38" : "16"} hint="2 on leave" icon={UserCog} />
        <StatCard label="Attendance Today" value={`${Math.round((ATTENDANCE_TODAY.present / ATTENDANCE_TODAY.totalStudents) * 100)}%`} hint={`${ATTENDANCE_TODAY.present}/${ATTENDANCE_TODAY.totalStudents} present`} icon={CalendarCheck} tone="primary" />
        <StatCard label="Outstanding Fees" value="XAF 4.2M" hint="63 pending invoices" icon={AlertCircle} tone="warning" />
        <StatCard label="Revenue (placeholder)" value="XAF 18.6M" hint="Term to date" icon={Wallet} tone="navy" />
        <StatCard label="Messages Sent" value={fmt(1242)} hint="This week" icon={MessageSquare} />
        <StatCard label="Growth" value="+8.4%" hint="MoM enrollment" icon={TrendingUp} tone="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Recent transactions</h2>
              <p className="text-xs text-muted-foreground">Last 5 payments across the school.</p>
            </div>
            <Link to="/dashboard/finance" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {TRANSACTIONS.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.student}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.category} · {t.method}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">XAF {t.paidAmount.toLocaleString()}</p>
                  <p className={`text-xs ${t.status === "Paid" ? "text-primary" : t.status === "Partial" ? "text-amber-600" : "text-destructive"}`}>{t.status}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Communication</h2>
              <p className="text-xs text-muted-foreground">Latest broadcasts.</p>
            </div>
            <Link to="/dashboard/messages" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              Open <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {MESSAGES.slice(0, 4).map((m) => (
              <li key={m.id} className="rounded-xl border border-border bg-background p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary">{m.channel}</span>
                  <span className={`text-[10px] font-semibold ${m.status === "Sent" ? "text-primary" : m.status === "Pending" ? "text-amber-600" : "text-destructive"}`}>{m.status}</span>
                </div>
                <p className="mt-2 truncate text-sm font-medium">{m.subject}</p>
                <p className="truncate text-xs text-muted-foreground">{m.audience} · {m.sentAt}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">
        <p>
          This is an MVP overview. Deeper analytics, BI dashboards and AI insights are planned for the next phase.
        </p>
      </div>
    </div>
  );
}
