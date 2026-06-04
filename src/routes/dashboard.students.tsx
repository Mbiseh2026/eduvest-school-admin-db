import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Search, Printer, Upload, MoreVertical, Wallet, CheckCircle2, AlertCircle, ClipboardList } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/PageHeader";
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
import { SectionToggle } from "@/components/eduvest/SectionToggle";
import { StudentProfileDialog } from "@/components/eduvest/StudentProfileDialog";
import {
  addManualSubclass,
  addStudents,
  getSubclasses,
  removeStudent,
  useStudents,
  useSubclasses,
} from "@/lib/eduvest/students-store";
import type { Student } from "@/lib/eduvest/dashboard-mock";
import { useWorkspace } from "@/hooks/use-workspace";
import { useOnboarding } from "@/hooks/use-onboarding";
import {
  detectSection,
  getAllWorkspaces,
  getSectionLevels,
  type AcademicSection,
} from "@/lib/eduvest/academic-levels";
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

function StudentsPage() {
  const navigate = useNavigate();
  const { workspace } = useWorkspace();
  const { state } = useOnboarding();
  const school = { name: state.profile.schoolName || "Greenfield School", primaryColor: state.branding.primaryColor };

  const allStudents = useStudents();
  const isAll = workspace === "All School";
  const [pickedWs, setPickedWs] = useState<string>("");
  const effectiveWs = isAll ? pickedWs : workspace;

  const [section, setSection] = useState<AcademicSection>("english");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [q, setQ] = useState("");

  const [profile, setProfile] = useState<Student | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [showAddSubclass, setShowAddSubclass] = useState(false);

  // Scope students to current workspace
  const scoped = useMemo(
    () => (effectiveWs ? allStudents.filter((s) => s.workspace === effectiveWs) : allStudents),
    [allStudents, effectiveWs],
  );

  // Section-aware level list
  const sectionLevels = effectiveWs ? getSectionLevels(effectiveWs, section) : [];

  // Subclasses for currently selected level
  const subclasses = useSubclasses(effectiveWs, selectedLevel);

  const filtered = useMemo(() => {
    let rows = scoped;
    // Filter by current section if a workspace is picked
    if (effectiveWs) {
      rows = rows.filter((s) => detectSection(s.workspace, s.level) === section);
    }
    if (selectedLevel) rows = rows.filter((s) => s.level === selectedLevel);
    if (selectedDivision) rows = rows.filter((s) => (s.division ?? "") === selectedDivision);
    if (q) {
      const qq = q.toLowerCase();
      rows = rows.filter(
        (s) =>
          s.name.toLowerCase().includes(qq) ||
          s.studentId.toLowerCase().includes(qq) ||
          s.parent.toLowerCase().includes(qq),
      );
    }
    return rows;
  }, [scoped, effectiveWs, section, selectedLevel, selectedDivision, q]);

  // Fees-focused analytics for the current filtered scope
  const stats = useMemo(() => {
    const total = filtered.length;
    const completed = filtered.filter((s) => s.totalFees > 0 && s.paidFees >= s.totalFees).length;
    const started = filtered.filter((s) => s.paidFees > 0 && s.paidFees < s.totalFees).length;
    const notStarted = filtered.filter((s) => s.paidFees === 0).length;
    const registered = filtered.filter((s) => s.registration === "Registered").length;
    const pending = filtered.filter((s) => s.registration === "Pending").length;
    return { total, completed, started, notStarted, registered, pending };
  }, [filtered]);

  const doPrint = (sort: StudentSortKey) => {
    const scope = selectedLevel
      ? `${effectiveWs} · ${selectedLevel}${selectedDivision ? " " + selectedDivision : ""}`
      : effectiveWs || workspace;
    printStudentList(filtered, school, sort, scope);
  };

  const today = new Date().toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" });

  const exportCsv = () => {
    const rows = [
      ["Workspace", "Class", "Division", "Student ID", "Name", "Parent", "Phone", "Email", "Total Fees", "Paid Fees", "Registration"],
      ...filtered.map((s) => [
        s.workspace, s.level, s.division ?? "", s.studentId, s.name, s.parent, s.parentPhone, s.parentEmail, s.totalFees, s.paidFees, s.registration,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students-${effectiveWs || "all"}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description={`Master list of every enrolled student — synced to Attendance, Digital ID, Finance & Messages.`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportCsv}>Export</Button>
            <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
              <Upload className="h-4 w-4" /> Import CSV
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm"><Printer className="h-4 w-4" /> Print</Button>
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
            <Button variant="hero" size="sm">
              <Plus className="h-4 w-4" /> Add student
            </Button>
          </>
        }
      />

      {/* Section toggle + date */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionToggle value={section} onChange={(s) => { setSection(s); setSelectedLevel(""); setSelectedDivision(""); }} />
        <span className="text-sm text-muted-foreground">Date: {today}</span>
      </div>

      {/* Fees-focused analytics */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard label="Total Students" value={stats.total} icon={ClipboardList} tone="primary" />
        <StatCard label="Fees Completed" value={stats.completed} icon={CheckCircle2} tone="navy" />
        <StatCard label="Fees Started" value={stats.started} icon={Wallet} tone="warning" />
        <StatCard label="Not Started" value={stats.notStarted} icon={AlertCircle} />
        <StatCard label="Registered" value={stats.registered} />
        <StatCard label="Pending Reg." value={stats.pending} />
      </div>

      {/* Workspace + Apply Filters row */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {isAll ? (
          <select
            value={pickedWs}
            onChange={(e) => { setPickedWs(e.target.value); setSelectedLevel(""); setSelectedDivision(""); }}
            className="h-9 rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="">Workspace: All</option>
            {getAllWorkspaces().map((w) => <option key={w}>{w}</option>)}
          </select>
        ) : (
          <span className="rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest">
            Workspace: {workspace}
          </span>
        )}
        <Button variant="outline" size="sm" onClick={() => { setSelectedLevel(""); setSelectedDivision(""); setQ(""); }}>Apply Filters</Button>
      </div>

      {/* Class chips */}
      {effectiveWs && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => { setSelectedLevel(""); setSelectedDivision(""); }}
            className={cn("rounded-xl border px-3 py-1.5 font-medium", !selectedLevel ? "border-primary text-primary" : "border-border text-muted-foreground")}
          >
            Class · All
          </button>
          {sectionLevels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => { setSelectedLevel(lvl); setSelectedDivision(""); }}
              className={cn("rounded-xl border px-3 py-1.5 font-medium", selectedLevel === lvl ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary")}
            >
              {lvl}
            </button>
          ))}
        </div>
      )}

      {/* Two-column layout: subclass column + student table */}
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        {/* Subclass column */}
        <aside className="rounded-2xl border border-border bg-card p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Subclass</p>
            {selectedLevel && (
              <Button variant="ghost" size="sm" onClick={() => setShowAddSubclass(true)}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          {!selectedLevel ? (
            <p className="text-xs text-muted-foreground">Select a class to see its subclasses.</p>
          ) : (
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedDivision("")}
                className={cn("w-full rounded-lg border px-3 py-1.5 text-left text-sm", !selectedDivision ? "border-primary bg-primary-soft text-primary" : "border-border")}
              >
                All
              </button>
              {subclasses.map((d) => (
                <button
                  key={d || "_none"}
                  onClick={() => setSelectedDivision(d)}
                  className={cn("w-full rounded-lg border px-3 py-1.5 text-left text-sm", selectedDivision === d ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary")}
                >
                  {selectedLevel}{d ? ` ${d}` : ""}
                </button>
              ))}
              {subclasses.length === 0 && (
                <p className="text-xs text-muted-foreground">No subclasses yet. Click + to add one.</p>
              )}
            </div>
          )}
        </aside>

        {/* Student table */}
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
                  <th className="px-4 py-3 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const bal = s.totalFees - s.paidFees;
                  return (
                    <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={s.photo} alt={s.name} className="h-9 w-9 rounded-full border border-border" />
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{s.studentId}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.workspace} · {s.className || s.level}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.parent}</td>
                      <td className="px-4 py-3 text-right">XAF {s.totalFees.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-semibold">{bal > 0 ? `XAF ${bal.toLocaleString()}` : "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${statusBadge(s.registration)}`}>{s.registration}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setProfile(s)}>View student details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate({ to: "/dashboard/messages" })}>Message parent</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate({ to: "/dashboard/digital-id" })}>Print ID card</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => { if (confirm(`Remove ${s.name}?`)) removeStudent(s.id); }}>
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">No students match the current filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {profile && (
        <StudentProfileDialog
          student={profile}
          onClose={() => setProfile(null)}
          onMessage={() => { setProfile(null); navigate({ to: "/dashboard/messages" }); }}
        />
      )}
      {showImport && (
        <ImportCsvDialog
          defaultWorkspace={effectiveWs || "Primary"}
          defaultLevel={selectedLevel}
          defaultDivision={selectedDivision}
          onClose={() => setShowImport(false)}
          onImport={(s) => addStudents(s)}
        />
      )}
      {showAddSubclass && selectedLevel && effectiveWs && (
        <AddSubclassDialog
          workspace={effectiveWs}
          level={selectedLevel}
          existing={subclasses}
          onClose={() => setShowAddSubclass(false)}
          onAdd={(d) => { addManualSubclass(effectiveWs, selectedLevel, d); setSelectedDivision(d); setShowAddSubclass(false); }}
        />
      )}
    </div>
  );
}

function AddSubclassDialog({
  workspace, level, existing, onClose, onAdd,
}: { workspace: string; level: string; existing: string[]; onClose: () => void; onAdd: (d: string) => void }) {
  const [letter, setLetter] = useState("");
  const available = ["A", "B", "C", "D", "E", "F", "G", "H"].filter((l) => !existing.includes(l));
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add subclass</DialogTitle>
          <DialogDescription>{workspace} · {level}. Pick a letter for the new stream.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
          {available.map((l) => (
            <button
              key={l}
              onClick={() => setLetter(l)}
              className={cn("h-10 w-10 rounded-xl border text-sm font-bold", letter === l ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary")}
            >
              {l}
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="hero" size="sm" disabled={!letter} onClick={() => onAdd(letter)}>
            Create {level} {letter}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImportCsvDialog({
  defaultWorkspace, defaultLevel, defaultDivision, onClose, onImport,
}: { defaultWorkspace: string; defaultLevel: string; defaultDivision: string; onClose: () => void; onImport: (s: Student[]) => void }) {
  const [text, setText] = useState("");
  const cols = "workspace,class,division,studentNumber,name,parent,guardian,parentPhone,parentEmail,totalFees,paidFees,registration";

  const parse = () => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    const rows = lines.slice(lines[0]?.toLowerCase().startsWith("workspace") ? 1 : 0);
    const parsed: Student[] = rows.map((line, i) => {
      const [workspace, level, division, studentId, name, parent, guardian, parentPhone, parentEmail, totalFees, paidFees, registration] = line.split(",").map((c) => c.trim());
      const ws = workspace || defaultWorkspace;
      const lvl = level || defaultLevel || "Class 1";
      const div = division || defaultDivision || "";
      // Auto-register the subclass so it appears in the sidebar
      if (div) addManualSubclass(ws, lvl, div);
      return {
        id: `imp-${Date.now()}-${i}`,
        name: name || "Unnamed",
        photo: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name || "S")}`,
        studentId: studentId || `IMP-${i}`,
        workspace: ws,
        level: lvl,
        division: div || undefined,
        className: div ? `${lvl} ${div}` : lvl,
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
          <DialogDescription>
            Columns: {cols}
            <br />
            <span className="text-[11px]">Leave <code>division</code> empty for schools without streams. New subclasses are added automatically.</span>
          </DialogDescription>
        </DialogHeader>
        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Secondary,Form 1,A,GFS-2026-001,New Student,Jane Doe,Jane Doe,+237...,jane@x.com,300000,100000,Registered\nSecondary,6ème,B,GFS-2026-002,Nouvel Élève,Jean Doe,Jean Doe,+237...,jean@x.com,300000,100000,Registered\nPrimary,Class 3,,GFS-2026-003,Small School Kid,Mary Doe,Mary Doe,+237...,mary@x.com,250000,250000,Registered`}
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
