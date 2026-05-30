import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarCheck,
  Clock,
  UserX,
  UserCheck,
  ArrowLeft,
  ChevronRight,
  Printer,
  Download,
  Upload,
  Mail,
  MessageSquare,
  Send,
  BellOff,
  Radio,
} from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import {
  ATTENDANCE_TODAY,
  ROLL_CALL_TODAY,
  STUDENT_ATTENDANCE,
  GATE_EVENTS,
  PARENT_ALERTS_TODAY,
  WEEKLY_ATTENDANCE,
  type RollCall,
} from "@/lib/eduvest/dashboard-mock";
import { LEVELS_BY_WORKSPACE, classLabel } from "@/lib/eduvest/academic-levels";
import { useWorkspace } from "@/hooks/use-workspace";

export const Route = createFileRoute("/dashboard/attendance")({
  head: () => ({ meta: [{ title: "Attendance — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: AttendancePage,
});

function AttendancePage() {
  const { workspace } = useWorkspace();
  const isAll = workspace === "All School";

  const [pickedWs, setPickedWs] = useState<string | null>(isAll ? null : workspace);
  const [pickedLevel, setPickedLevel] = useState<string | null>(null);
  const [pickedDivision, setPickedDivision] = useState<string | null>(null);
  const [tab, setTab] = useState<"class" | "gate">("class");

  // Reset internal state if workspace changes
  const effectiveWs = isAll ? pickedWs : workspace;

  const scopedRollCalls = useMemo(
    () => (effectiveWs ? ROLL_CALL_TODAY.filter((r) => r.workspace === effectiveWs) : ROLL_CALL_TODAY),
    [effectiveWs],
  );

  const selectedRollCall: RollCall | null = useMemo(() => {
    if (!pickedLevel) return null;
    return (
      scopedRollCalls.find(
        (r) => r.level === pickedLevel && (r.division ?? "") === (pickedDivision ?? ""),
      ) ?? null
    );
  }, [scopedRollCalls, pickedLevel, pickedDivision]);

  const completed = scopedRollCalls.filter((r) => r.status === "Completed").length;
  const teachersWhoSubmitted = new Set(
    scopedRollCalls.filter((r) => r.status === "Completed").map((r) => r.teacherId),
  ).size;
  const totalTeachers = new Set(scopedRollCalls.map((r) => r.teacherId)).size;

  const scopedAlerts = useMemo(
    () => (effectiveWs ? PARENT_ALERTS_TODAY.filter((a) => a.workspace === effectiveWs) : PARENT_ALERTS_TODAY),
    [effectiveWs],
  );

  const scopedGate = useMemo(
    () => (effectiveWs ? GATE_EVENTS.filter((g) => g.workspace === effectiveWs) : GATE_EVENTS),
    [effectiveWs],
  );

  const exportCsv = () => {
    const rows = [
      ["Workspace", "Class", "Subject", "Teacher", "Time", "Status", "Present", "Absent", "Late", "Excused"],
      ...scopedRollCalls.map((r) => [
        r.workspace,
        classLabel(r.level, r.division),
        r.subject,
        r.teacher,
        `${r.startsAt}–${r.endsAt}`,
        r.status,
        r.present,
        r.absent,
        r.late,
        r.excused,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${effectiveWs ?? "all"}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="View Attendance"
        description="Live data synced from the EduVest Attendance App. Marking happens in the app — the dashboard monitors results."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4" /> Download CSV</Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
            <Button variant="outline" size="sm" disabled title="Attendance is captured in the Attendance App"><Upload className="h-4 w-4" /> Import</Button>
          </>
        }
      />

      {/* Top stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Present today" value={ATTENDANCE_TODAY.present} hint={`of ${ATTENDANCE_TODAY.totalStudents}`} icon={UserCheck} tone="primary" />
        <StatCard label="Late" value={ATTENDANCE_TODAY.late} icon={Clock} tone="warning" />
        <StatCard label="Absent" value={ATTENDANCE_TODAY.absent} hint="Auto-alert queued" icon={UserX} />
        <StatCard label="Roll calls" value={`${completed}/${scopedRollCalls.length}`} hint={`Teachers submitted ${teachersWhoSubmitted}/${totalTeachers}`} icon={CalendarCheck} tone="navy" />
      </div>

      {/* Breadcrumb / drill-down chips */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {(pickedWs || pickedLevel) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (pickedLevel) {
                setPickedLevel(null);
                setPickedDivision(null);
              } else if (isAll && pickedWs) {
                setPickedWs(null);
              }
            }}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        )}
        <span className="text-muted-foreground">All School</span>
        {effectiveWs && (
          <>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{effectiveWs}</span>
          </>
        )}
        {pickedLevel && (
          <>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{classLabel(pickedLevel, pickedDivision ?? undefined)}</span>
          </>
        )}
      </div>

      {/* Workspace picker (only when "All School" and no workspace chosen) */}
      {isAll && !pickedWs && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold">Choose a workspace</h2>
          <p className="text-xs text-muted-foreground">Each workspace shows its own classes, streams, and attendance.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.keys(LEVELS_BY_WORKSPACE).map((ws) => {
              const ws_rolls = ROLL_CALL_TODAY.filter((r) => r.workspace === ws);
              return (
                <button
                  key={ws}
                  onClick={() => setPickedWs(ws)}
                  className="rounded-xl border border-border bg-background p-4 text-left transition hover:border-primary hover:shadow-soft"
                >
                  <p className="font-semibold">{ws}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {ws_rolls.length} roll call{ws_rolls.length === 1 ? "" : "s"} today ·{" "}
                    {ws_rolls.filter((r) => r.status === "Completed").length} completed
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Level + stream picker */}
      {effectiveWs && !pickedLevel && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold">Choose a class</h2>
          <p className="text-xs text-muted-foreground">{effectiveWs} → Level → Stream</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(LEVELS_BY_WORKSPACE[effectiveWs] ?? []).map((lvl) => {
              const variants = scopedRollCalls.filter((r) => r.level === lvl);
              if (variants.length === 0) {
                return (
                  <button
                    key={lvl}
                    onClick={() => {
                      setPickedLevel(lvl);
                      setPickedDivision(null);
                    }}
                    className="rounded-full border border-dashed border-border bg-background px-4 py-1.5 text-xs text-muted-foreground hover:border-primary"
                  >
                    {lvl} <span className="ml-1 opacity-60">no roll call today</span>
                  </button>
                );
              }
              return variants.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setPickedLevel(r.level);
                    setPickedDivision(r.division ?? null);
                  }}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                    r.status === "Completed"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  } hover:border-primary`}
                >
                  {classLabel(r.level, r.division)} · {r.status}
                </button>
              ));
            })}
          </div>
        </div>
      )}

      {/* Selected class detail */}
      {selectedRollCall && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">
                {classLabel(selectedRollCall.level, selectedRollCall.division)} · {selectedRollCall.subject}
              </h2>
              <p className="text-xs text-muted-foreground">
                {selectedRollCall.teacher} · {selectedRollCall.startsAt}–{selectedRollCall.endsAt} ·{" "}
                {selectedRollCall.status === "Completed"
                  ? `Submitted ${selectedRollCall.submittedAt}`
                  : "Pending roll call"}
              </p>
            </div>
            <div className="flex gap-1 rounded-full border border-border bg-secondary/50 p-1 text-xs">
              <button
                onClick={() => setTab("class")}
                className={`rounded-full px-3 py-1 ${tab === "class" ? "bg-background font-semibold shadow-soft" : "text-muted-foreground"}`}
              >
                Class roll call
              </button>
              <button
                onClick={() => setTab("gate")}
                className={`rounded-full px-3 py-1 ${tab === "gate" ? "bg-background font-semibold shadow-soft" : "text-muted-foreground"}`}
              >
                Gate entries
              </button>
            </div>
          </div>

          {tab === "class" ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-left font-medium">Student</th>
                    <th className="px-3 py-2 text-left font-medium">Status</th>
                    <th className="px-3 py-2 text-left font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {STUDENT_ATTENDANCE.filter((a) => a.rollCallId === selectedRollCall.id).map((a) => (
                    <tr key={a.studentId} className="border-b border-border last:border-0">
                      <td className="px-3 py-3 font-medium">{a.studentName}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            a.status === "Present"
                              ? "bg-emerald-100 text-emerald-700"
                              : a.status === "Late"
                                ? "bg-amber-100 text-amber-700"
                                : a.status === "Absent"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{a.time ?? "—"}</td>
                    </tr>
                  ))}
                  {selectedRollCall.status === "Pending" && (
                    <tr><td colSpan={3} className="px-3 py-8 text-center text-xs text-muted-foreground">Roll call has not been submitted from the Attendance App yet.</td></tr>
                  )}
                  {selectedRollCall.status === "Completed" && STUDENT_ATTENDANCE.filter((a) => a.rollCallId === selectedRollCall.id).length === 0 && (
                    <tr><td colSpan={3} className="px-3 py-8 text-center text-xs text-muted-foreground">All students marked Present.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-left font-medium">Student</th>
                    <th className="px-3 py-2 text-left font-medium">Gate</th>
                    <th className="px-3 py-2 text-left font-medium">Direction</th>
                    <th className="px-3 py-2 text-left font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {scopedGate
                    .filter((g) => g.level === selectedRollCall.level && (g.division ?? "") === (selectedRollCall.division ?? ""))
                    .map((g) => (
                      <tr key={g.id} className="border-b border-border last:border-0">
                        <td className="px-3 py-3 font-medium">{g.studentName}</td>
                        <td className="px-3 py-3">{g.gate}</td>
                        <td className="px-3 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${g.direction === "IN" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>{g.direction}</span>
                        </td>
                        <td className="px-3 py-3 text-muted-foreground">{g.time}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Roll Call Monitoring */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Roll call status</h2>
            <p className="text-xs text-muted-foreground">Live from the Attendance App. Track which teachers have submitted.</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
            <Radio className="h-3 w-3" /> Live
          </span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-3 py-2 text-left font-medium">Class</th>
                <th className="px-3 py-2 text-left font-medium">Subject</th>
                <th className="px-3 py-2 text-left font-medium">Teacher</th>
                <th className="px-3 py-2 text-left font-medium">Time</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {scopedRollCalls.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="px-3 py-3 font-medium">{r.workspace} · {classLabel(r.level, r.division)}</td>
                  <td className="px-3 py-3">{r.subject}</td>
                  <td className="px-3 py-3 text-muted-foreground">{r.teacher}</td>
                  <td className="px-3 py-3 text-muted-foreground">{r.startsAt}–{r.endsAt}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{r.status}</span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{r.submittedAt ?? "—"}</td>
                </tr>
              ))}
              {scopedRollCalls.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-8 text-center text-xs text-muted-foreground">No roll calls scheduled.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parent alerts */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-base font-semibold">Parent alerts — today</h2>
        <p className="text-xs text-muted-foreground">Auto-generated from Late, Absent and missing gate entries. Send from the dashboard.</p>
        <div className="mt-4 space-y-2">
          {scopedAlerts.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {a.studentName} <span className="text-xs font-normal text-muted-foreground">· {classLabel(a.level, a.division)} · {a.workspace}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {a.reason} — to {a.parentName}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {a.channels.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px]">
                    {c === "Email" && <Mail className="h-3 w-3" />}
                    {c === "WhatsApp" && <MessageSquare className="h-3 w-3" />}
                    {c === "Dashboard" && <Radio className="h-3 w-3" />}
                    {c}
                    {c === "WhatsApp" && <span className="ml-1 text-[10px] text-muted-foreground">soon</span>}
                  </span>
                ))}
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${a.status === "Sent" ? "bg-emerald-100 text-emerald-700" : a.status === "Snoozed" ? "bg-slate-100 text-slate-700" : "bg-amber-100 text-amber-700"}`}>{a.status}</span>
                <Button variant="hero" size="sm" disabled={a.status === "Sent"}><Send className="h-3 w-3" /> Send now</Button>
                <Button variant="outline" size="sm"><BellOff className="h-3 w-3" /> Snooze</Button>
              </div>
            </div>
          ))}
          {scopedAlerts.length === 0 && (
            <p className="py-6 text-center text-xs text-muted-foreground">No alerts in this workspace today.</p>
          )}
        </div>
      </div>

      {/* Weekly summary */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-base font-semibold">Weekly summary</h2>
        <p className="text-xs text-muted-foreground">Auto-shared with parents every <strong>Sunday evening</strong> — present days, absent days, late count and attendance %.</p>
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
              {WEEKLY_ATTENDANCE.map((r) => (
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
              <tr className="bg-primary-soft/40">
                <td className="px-3 py-3 font-semibold">Sun</td>
                <td colSpan={3} className="px-3 py-3 text-xs text-primary">Report auto-sent to parents</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
