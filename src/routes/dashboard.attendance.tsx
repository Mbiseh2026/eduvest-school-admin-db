import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
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
  ClipboardList,
  MessageCircle,
  ShieldCheck,
  DoorOpen,
  DoorClosed,
  Users as UsersIcon,
  Bell,
  Info,
  LogOut,
  Settings as SettingsIcon,
  RefreshCw,
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
import { LEVELS_BY_WORKSPACE, classLabel, detectSection, type AcademicSection } from "@/lib/eduvest/academic-levels";
import { useWorkspace } from "@/hooks/use-workspace";
import { SectionToggle } from "@/components/eduvest/SectionToggle";
import { useStudents } from "@/lib/eduvest/students-store";

type AttendanceView = "class" | "gate";

export const Route = createFileRoute("/dashboard/attendance")({
  head: () => ({ meta: [{ title: "Attendance — EduVest" }, { name: "robots", content: "noindex" }] }),
  validateSearch: (s: Record<string, unknown>): { view?: AttendanceView } => {
    const v = s.view;
    return { view: v === "gate" || v === "class" ? v : undefined };
  },
  component: AttendancePage,
});

const REPORT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type ReportDay = (typeof REPORT_DAYS)[number];

function AttendancePage() {
  const { workspace } = useWorkspace();
  const isAll = workspace === "All School";
  const navigate = useNavigate();
  const search = useSearch({ from: "/dashboard/attendance" });
  const view: AttendanceView = search.view ?? "class";

  const [pickedWs, setPickedWs] = useState<string | null>(isAll ? null : workspace);
  const [pickedLevel, setPickedLevel] = useState<string | null>(null);
  const [pickedDivision, setPickedDivision] = useState<string | null>(null);
  const [section, setSection] = useState<AcademicSection>("english");
  const allStudents = useStudents();

  const [reportDay, setReportDay] = useState<ReportDay>(() => {
    if (typeof window === "undefined") return "Fri";
    return (localStorage.getItem("eduvest:reportDay") as ReportDay) || "Fri";
  });
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("eduvest:reportDay", reportDay);
  }, [reportDay]);

  const setView = (v: AttendanceView) =>
    navigate({ to: "/dashboard/attendance", search: { view: v } });

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

  // Gate-level metrics
  const gateIn = scopedGate.filter((g) => g.direction === "IN").length;
  const gateOut = scopedGate.filter((g) => g.direction === "OUT").length;
  const inSchool = Math.max(gateIn - gateOut, 0);
  const expected = ATTENDANCE_TODAY.totalStudents;
  const missingEntry = Math.max(expected - gateIn, 0);

  const exportCsv = () => {
    const rows =
      view === "class"
        ? [
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
          ]
        : [
            ["Workspace", "Class", "Student", "Gate", "Direction", "Time"],
            ...scopedGate.map((g) => [
              g.workspace,
              classLabel(g.level, g.division),
              g.studentName,
              g.gate,
              g.direction,
              g.time,
            ]),
          ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${view === "class" ? "rollcall" : "gate"}-${effectiveWs ?? "all"}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={view === "class" ? "Class Roll Call" : "Gate Attendance"}
        description={
          view === "class"
            ? "Per-class attendance synced from the EduVest Attendance App. Only absent, late, excused students or those with a remark are listed — everyone else is present by default."
            : "Live entry/exit log captured at the school gates. Use this to confirm a child arrived on campus, independent of class roll call."
        }
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4" /> Download CSV</Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
            <Button variant="outline" size="sm" disabled title="Attendance is captured in the Attendance App"><Upload className="h-4 w-4" /> Import</Button>
          </>
        }
      />

      {/* Big view switcher — replaces the unclear stats header */}
      <div className="rounded-2xl border border-border bg-card p-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setView("class")}
            className={`flex items-start gap-3 rounded-xl p-4 text-left transition ${
              view === "class" ? "bg-primary-soft ring-2 ring-primary" : "hover:bg-secondary/60"
            }`}
          >
            <ClipboardList className={`h-5 w-5 shrink-0 ${view === "class" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${view === "class" ? "text-primary" : ""}`}>Class Roll Call</p>
              <p className="text-xs text-muted-foreground">Per-class attendance marked by teachers in class.</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setView("gate")}
            className={`flex items-start gap-3 rounded-xl p-4 text-left transition ${
              view === "gate" ? "bg-primary-soft ring-2 ring-primary" : "hover:bg-secondary/60"
            }`}
          >
            <DoorOpen className={`h-5 w-5 shrink-0 ${view === "gate" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${view === "gate" ? "text-primary" : ""}`}>Gate Attendance</p>
              <p className="text-xs text-muted-foreground">Entry & exit log scanned at the school gates.</p>
            </div>
          </button>
        </div>
      </div>

      {/* Section + date */}
      {view === "class" && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionToggle value={section} onChange={setSection} />
          <span className="text-sm text-muted-foreground">
            Date: {new Date().toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" })}
          </span>
        </div>
      )}

      {/* === VIEW-SPECIFIC STATS === */}
      {view === "class" ? (
        <>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ClipboardList className="h-3.5 w-3.5" /> Class Roll Call · today
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <StatCard label="Total Students" value={ATTENDANCE_TODAY.totalStudents} icon={ClipboardList} tone="primary" />
            <StatCard label="Present (class)" value={ATTENDANCE_TODAY.present} icon={UserCheck} tone="navy" />
            <StatCard label="Absent (class)" value={ATTENDANCE_TODAY.absent} icon={UserX} />
            <StatCard label="Late (class)" value={ATTENDANCE_TODAY.late} icon={Clock} tone="warning" />
            <StatCard label="Excused" value={STUDENT_ATTENDANCE.filter((a) => a.status === "Excused").length} icon={ShieldCheck} />
            <StatCard
              label="Remarks Today"
              value={allStudents.reduce(
                (n, s) => n + ((s.remarks ?? []).filter((r) => r.date === new Date().toISOString().slice(0, 10)).length),
                0,
              )}
              icon={MessageCircle}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="Roll calls" value={`${completed}/${scopedRollCalls.length}`} hint={`Teachers submitted ${teachersWhoSubmitted}/${totalTeachers}`} icon={CalendarCheck} tone="navy" />
            <StatCard label="Section" value={section === "english" ? "English" : "French"} hint="Switch with the toggle above" />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <DoorOpen className="h-3.5 w-3.5" /> Gate Attendance · today
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Expected" value={expected} icon={UsersIcon} tone="primary" />
            <StatCard label="Entries (IN)" value={gateIn} icon={DoorOpen} tone="navy" />
            <StatCard label="Exits (OUT)" value={gateOut} icon={DoorClosed} />
            <StatCard label="Currently in school" value={inSchool} icon={ShieldCheck} tone="navy" />
            <StatCard label="No entry yet" value={missingEntry} icon={UserX} tone="warning" />
          </div>
        </>
      )}

      {/* Breadcrumb */}
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

      {/* Workspace picker */}
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

      {/* === CLASS VIEW: class picker + selected class detail === */}
      {view === "class" && effectiveWs && !pickedLevel && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold">Choose a class</h2>
          <p className="text-xs text-muted-foreground">{effectiveWs} → Level → Stream</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(LEVELS_BY_WORKSPACE[effectiveWs] ?? []).filter((lvl) => detectSection(effectiveWs, lvl) === section).map((lvl) => {
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

      {view === "class" && selectedRollCall && (
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
          </div>

          {/* Class roll call list */}
          <div className="mt-4 overflow-x-auto">
            <p className="mb-2 text-xs text-muted-foreground">
              <Info className="mr-1 inline h-3 w-3" /> Only students who are absent, late, excused, or have a remark are listed. Everyone else is marked present by default.
            </p>
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

          {/* Embedded gate snapshot for this class (synced from Gate Attendance) */}
          <div className="mt-6 rounded-xl border border-border bg-secondary/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold flex items-center gap-2"><DoorOpen className="h-4 w-4" /> Gate entries for this class</p>
                <p className="text-xs text-muted-foreground">Synced from Gate Attendance — useful to confirm a missing student actually reached campus.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setView("gate")}>Open full gate log <ChevronRight className="h-3 w-3" /></Button>
            </div>
            <div className="mt-3 overflow-x-auto">
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
                  {scopedGate.filter((g) => g.level === selectedRollCall.level && (g.division ?? "") === (selectedRollCall.division ?? "")).length === 0 && (
                    <tr><td colSpan={4} className="px-3 py-6 text-center text-xs text-muted-foreground">No gate scans for this class yet today.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* === GATE VIEW: full gate log === */}
      {view === "gate" && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Gate log — today</h2>
              <p className="text-xs text-muted-foreground">All scans from every campus gate. Filter by workspace using the breadcrumb above.</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              <Radio className="h-3 w-3" /> Live
            </span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-medium">Student</th>
                  <th className="px-3 py-2 text-left font-medium">Class</th>
                  <th className="px-3 py-2 text-left font-medium">Gate</th>
                  <th className="px-3 py-2 text-left font-medium">Direction</th>
                  <th className="px-3 py-2 text-left font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {scopedGate.map((g) => (
                  <tr key={g.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                    <td className="px-3 py-3 font-medium">{g.studentName}</td>
                    <td className="px-3 py-3 text-muted-foreground">{g.workspace} · {classLabel(g.level, g.division)}</td>
                    <td className="px-3 py-3">{g.gate}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${g.direction === "IN" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>{g.direction}</span>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{g.time}</td>
                  </tr>
                ))}
                {scopedGate.length === 0 && (
                  <tr><td colSpan={5} className="px-3 py-8 text-center text-xs text-muted-foreground">No gate scans yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roll Call Monitoring (class view only) */}
      {view === "class" && (
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
      )}

      {/* Parent alerts */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-base font-semibold">Parent alerts — today</h2>
        <p className="text-xs text-muted-foreground">
          Auto-generated from Late, Absent and missing gate entries. Each parent is notified only about their own child — never about the whole school.
        </p>
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
                    {c === "Push" && <Bell className="h-3 w-3" />}
                    {c === "Direct" && <Radio className="h-3 w-3" />}
                    {c}
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
        <p className="mt-3 text-[11px] text-muted-foreground">
          Channels available: <strong>Push</strong>, <strong>WhatsApp</strong>, <strong>Direct Message</strong> and <strong>Email</strong>. The school chooses which channels to enable in Settings.
        </p>
      </div>

      {/* Weekly summary */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Weekly summary</h2>
            <p className="text-xs text-muted-foreground">
              Auto-shared with each parent on the day below — present days, absent days, late count and attendance % for <em>their own child only</em>.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Send weekly report on</span>
            <select
              value={reportDay}
              onChange={(e) => setReportDay(e.target.value as ReportDay)}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium"
            >
              {REPORT_DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
        </div>
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
                <tr key={r.day} className={`border-b border-border last:border-0 ${r.day === reportDay ? "bg-primary-soft/40" : ""}`}>
                  <td className="px-3 py-3 font-medium">
                    {r.day}
                    {r.day === reportDay && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">Report day</span>}
                  </td>
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
        <p className="mt-3 text-[11px] text-muted-foreground">
          Termly and annual reports covering all students or whole-school stats are sent separately from Reports → Broadcast.
        </p>
      </div>
    </div>
  );
}
