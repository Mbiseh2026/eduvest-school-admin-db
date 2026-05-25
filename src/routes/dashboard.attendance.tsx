import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Clock, UserX, UserCheck } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { ATTENDANCE_TODAY } from "@/lib/eduvest/dashboard-mock";

export const Route = createFileRoute("/dashboard/attendance")({
  head: () => ({ meta: [{ title: "Attendance — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: AttendancePage,
});

function AttendancePage() {
  const a = ATTENDANCE_TODAY;
  const periods: Array<{ label: string; rows: { day: string; present: number; absent: number; rate: number }[] }> = [
    {
      label: "This week",
      rows: [
        { day: "Mon", present: 422, absent: 35, rate: 92 },
        { day: "Tue", present: 431, absent: 26, rate: 94 },
        { day: "Wed", present: 415, absent: 42, rate: 91 },
        { day: "Thu", present: 408, absent: 49, rate: 89 },
        { day: "Fri", present: 412, absent: 45, rate: 90 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Foundation view — the full engine and Gate App arrive in the next phase."
        actions={
          <>
            <Button variant="outline" size="sm">Export</Button>
            <Button variant="hero" size="sm">Mark attendance</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Present today" value={a.present} hint={`of ${a.totalStudents}`} icon={UserCheck} tone="primary" />
        <StatCard label="Late" value={a.late} hint="Arrived after 8:15" icon={Clock} tone="warning" />
        <StatCard label="Absent" value={a.absent} hint="Auto-alert sent" icon={UserX} />
        <StatCard label="Teachers present" value={`${a.teachersPresent}/${a.totalTeachers}`} icon={CalendarCheck} tone="navy" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-base font-semibold">Weekly summary</h2>
        <p className="text-xs text-muted-foreground">Auto-shared with parents every Friday afternoon.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-3 py-2 text-left font-medium">Day</th>
                <th className="px-3 py-2 text-left font-medium">Present</th>
                <th className="px-3 py-2 text-left font-medium">Absent</th>
                <th className="px-3 py-2 text-left font-medium">Rate</th>
              </tr>
            </thead>
            <tbody>
              {periods[0].rows.map((r) => (
                <tr key={r.day} className="border-b border-border last:border-0">
                  <td className="px-3 py-3 font-medium">{r.day}</td>
                  <td className="px-3 py-3">{r.present}</td>
                  <td className="px-3 py-3">{r.absent}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-gradient-brand" style={{ width: `${r.rate}%` }} />
                      </div>
                      <span className="text-xs font-semibold">{r.rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {["Daily report", "Weekly report", "Monthly report"].map((t) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold">{t}</h3>
            <p className="mt-1 text-xs text-muted-foreground">Lightweight MVP report. Detail views land with the attendance engine.</p>
            <Button variant="outline" size="sm" className="mt-4">Generate</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
