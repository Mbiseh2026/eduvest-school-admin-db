import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Search, Printer, Upload, ChevronRight, ArrowLeft, IdCard as IdCardIcon, Phone, Mail } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STUDENTS, type Student } from "@/lib/eduvest/dashboard-mock";
import { useWorkspace } from "@/hooks/use-workspace";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useLanguage } from "@/hooks/use-language";
import { getLevels, getAllWorkspaces } from "@/lib/eduvest/academic-levels";
import { printStudentList, type StudentSortKey } from "@/lib/eduvest/print-pdf";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/students")({
  head: () => ({ meta: [{ title: "Students — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: StudentsPage,
});

function statusBadge(reg: Student["registration"]) {
  if (reg === "Registered") return "bg-primary-soft text-primary";
  if (reg === "Pending") return "bg-amber-100 text-amber-700";
  return "bg-secondary text-muted-foreground";
}

function feesStatus(s: Student): { label: string; cls: string } {
  const bal = s.totalFees - s.paidFees;
  if (bal <= 0) return { label: "Paid", cls: "text-primary" };
  if (s.paidFees > 0) return { label: "Partial", cls: "text-amber-600" };
  return { label: "Outstanding", cls: "text-destructive" };
}

function StudentsPage() {
  const navigate = useNavigate();
  const { workspace } = useWorkspace();
  const { lang } = useLanguage();
  const { state } = useOnboarding();
  const school = { name: state.profile.schoolName || "Greenfield School", primaryColor: state.branding.primaryColor };

  const isAll = workspace === "All School";
  const lockedWs = isAll ? null : workspace;

  const [pickedWs, setPickedWs] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [q, setQ] = useState("");
  const [profile, setProfile] = useState<Student | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [students, setStudents] = useState<Student[]>(STUDENTS);

  const selectedWs = lockedWs ?? pickedWs;

  // Base data already scoped to current workspace (unless All School).
  const scoped = useMemo(
    () => (lockedWs ? students.filter((s) => s.workspace === lockedWs) : students),
    [students, lockedWs],
  );

  const workspaces = useMemo(() => {
    if (lockedWs) return [lockedWs];
    const ws = new Set<string>();
    scoped.forEach((s) => ws.add(s.workspace));
    return Array.from(ws).filter((w) => getAllWorkspaces().includes(w) || w);
  }, [scoped, lockedWs]);

  const filtered = useMemo(() => {
    let rows = scoped;
    if (selectedWs) rows = rows.filter((s) => s.workspace === selectedWs);
    if (selectedLevel) rows = rows.filter((s) => s.level === selectedLevel);
    if (q)
      rows = rows.filter(
        (s) =>
          s.name.toLowerCase().includes(q.toLowerCase()) ||
          s.studentId.toLowerCase().includes(q.toLowerCase()) ||
          s.parent.toLowerCase().includes(q.toLowerCase()),
      );
    return rows;
  }, [scoped, selectedWs, selectedLevel, q]);

  const doPrint = (sort: StudentSortKey) => {
    const scope = selectedLevel ? `${selectedWs} · ${selectedLevel}` : selectedWs || workspace;
    printStudentList(filtered, school, sort, scope);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description={
          selectedLevel
            ? `${filtered.length} student${filtered.length === 1 ? "" : "s"} in ${selectedWs} · ${selectedLevel}`
            : selectedWs
              ? `${selectedWs} — pick a class to see students.`
              : `Workspace: ${workspace}. Choose a workspace to start.`
        }
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4" /> Print
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Print student list</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => doPrint("alphabetical")}>Alphabetical</DropdownMenuItem>
                <DropdownMenuItem onClick={() => doPrint("fees")}>By fees balance</DropdownMenuItem>
                <DropdownMenuItem onClick={() => doPrint("registration")}>By registration</DropdownMenuItem>
                <DropdownMenuItem onClick={() => doPrint("class")}>By class</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
              <Upload className="h-4 w-4" /> Import CSV
            </Button>
            <Button variant="hero" size="sm">
              <Plus className="h-4 w-4" /> Add student
            </Button>
          </>
        }
      />

      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {isAll ? (
          <button onClick={() => { setPickedWs(""); setSelectedLevel(""); }} className="text-muted-foreground hover:text-foreground">All workspaces</button>
        ) : (
          <span className="font-semibold text-foreground">{workspace}</span>
        )}
        {selectedWs && (<><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /><button onClick={() => setSelectedLevel("")} className={cn("hover:text-foreground", selectedLevel ? "text-muted-foreground" : "font-semibold text-foreground")}>{selectedWs}</button></>)}
        {selectedLevel && (<><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /><span className="font-semibold">{selectedLevel}</span></>)}
      </div>

      {/* Filter chips */}
      <div className="space-y-2">
        {isAll && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground">Workspace:</span>
            <button onClick={() => { setPickedWs(""); setSelectedLevel(""); }} className={cn("rounded-full border px-2.5 py-1", !pickedWs ? "border-primary text-primary" : "border-border text-muted-foreground")}>All</button>
            {workspaces.map((w) => (
              <button key={w} onClick={() => { setPickedWs(w); setSelectedLevel(""); }} className={cn("rounded-full border px-2.5 py-1", pickedWs === w ? "border-primary text-primary" : "border-border text-muted-foreground")}>{w}</button>
            ))}
          </div>
        )}
        {selectedWs && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground">Class:</span>
            <button onClick={() => setSelectedLevel("")} className={cn("rounded-full border px-2.5 py-1", !selectedLevel ? "border-primary text-primary" : "border-border text-muted-foreground")}>All</button>
            {getLevels(selectedWs, lang).map((lvl) => (
              <button key={lvl} onClick={() => setSelectedLevel(lvl)} className={cn("rounded-full border px-2.5 py-1", selectedLevel === lvl ? "border-primary text-primary" : "border-border text-muted-foreground")}>{lvl}</button>
            ))}
          </div>
        )}
      </div>

      {/* STUDENT TABLE — always visible */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border p-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search students…"
              className="h-9 w-full rounded-full border border-border bg-secondary/40 pl-9 pr-4 text-sm outline-none focus:bg-background focus:border-primary"
            />
          </div>
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} student{filtered.length === 1 ? "" : "s"}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium">Student</th>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Class</th>
                <th className="px-4 py-3 text-left font-medium">Parent</th>
                <th className="px-4 py-3 text-right font-medium">Total fees</th>
                <th className="px-4 py-3 text-right font-medium">Balance</th>
                <th className="px-4 py-3 text-left font-medium">Registration</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const bal = s.totalFees - s.paidFees;
                return (
                  <tr key={s.id} onClick={() => setProfile(s)} className="cursor-pointer border-b border-border last:border-0 hover:bg-secondary/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={s.photo} alt={s.name} className="h-9 w-9 rounded-full border border-border" />
                        <span className="font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{s.studentId}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.workspace} · {s.level}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.parent}</td>
                    <td className="px-4 py-3 text-right">XAF {s.totalFees.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold">{bal > 0 ? `XAF ${bal.toLocaleString()}` : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${statusBadge(s.registration)}`}>{s.registration}</span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No students match the current filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {profile && <StudentProfileDialog student={profile} onClose={() => setProfile(null)} onMessage={() => navigate({ to: "/dashboard/messages" })} />}
      {showImport && <ImportCsvDialog onClose={() => setShowImport(false)} onImport={(s) => setStudents((prev) => [...s, ...prev])} />}
    </div>
  );
}

function StudentProfileDialog({ student, onClose, onMessage }: { student: Student; onClose: () => void; onMessage: () => void }) {
  const fees = feesStatus(student);
  const bal = student.totalFees - student.paidFees;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Student profile</DialogTitle>
          <DialogDescription>{student.studentId}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
          <img src={student.photo} alt={student.name} className="h-28 w-28 rounded-2xl border border-border" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{student.name}</h3>
            <p className="text-sm text-muted-foreground">{student.workspace} · {student.level}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${statusBadge(student.registration)}`}>{student.registration}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Digital ID: {student.digitalId}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${fees.cls === "text-primary" ? "bg-primary-soft text-primary" : fees.cls === "text-amber-600" ? "bg-amber-100 text-amber-700" : "bg-destructive/10 text-destructive"}`}>Fees: {fees.label}</span>
            </div>
          </div>
        </div>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <Field label="Parent / Guardian" value={student.guardian || student.parent} />
          <Field label="Attendance" value={`${student.attendance}%`} />
          <Field label="Phone" value={student.parentPhone} icon={Phone} />
          <Field label="Email" value={student.parentEmail} icon={Mail} />
          <Field label="Total fees" value={`XAF ${student.totalFees.toLocaleString()}`} />
          <Field label="Paid" value={`XAF ${student.paidFees.toLocaleString()}`} />
          <Field label="Balance" value={bal > 0 ? `XAF ${bal.toLocaleString()}` : "Settled"} />
          <Field label="Digital ID" value={student.digitalId} icon={IdCardIcon} />
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          <Button variant="hero" size="sm" onClick={onMessage}>Message parent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {value}
      </p>
    </div>
  );
}

function ImportCsvDialog({ onClose, onImport }: { onClose: () => void; onImport: (s: Student[]) => void }) {
  const [text, setText] = useState("");
  const cols = "workspace,class,studentNumber,name,parent,guardian,parentPhone,parentEmail,totalFees,paidFees,registration";

  const parse = () => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    const rows = lines.slice(lines[0]?.toLowerCase().startsWith("workspace") ? 1 : 0);
    const parsed: Student[] = rows.map((line, i) => {
      const [workspace, level, studentId, name, parent, guardian, parentPhone, parentEmail, totalFees, paidFees, registration] = line.split(",").map((c) => c.trim());
      return {
        id: `imp-${Date.now()}-${i}`,
        name: name || "Unnamed",
        photo: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name || "S")}`,
        studentId: studentId || `IMP-${i}`,
        workspace: workspace || "Primary",
        level: level || "Class 1",
        className: level || "",
        parent: parent || "",
        guardian: guardian || parent || "",
        parentPhone: parentPhone || "",
        parentEmail: parentEmail || "",
        attendance: 100,
        status: "Active",
        registration: (registration as Student["registration"]) || "Registered",
        totalFees: Number(totalFees) || 0,
        paidFees: Number(paidFees) || 0,
        digitalId: "Pending",
      };
    });
    onImport(parsed);
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import students from CSV</DialogTitle>
          <DialogDescription>Columns: {cols}</DialogDescription>
        </DialogHeader>
        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Primary,Class 1,GFS-2026-001,New Student,Jane Doe,Jane Doe,+237...,jane@x.com,300000,100000,Registered`}
          className="w-full rounded-xl border border-border bg-background p-3 font-mono text-xs outline-none focus:border-primary"
        />
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="hero" size="sm" onClick={parse}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
