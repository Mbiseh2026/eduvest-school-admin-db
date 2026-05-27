import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, ClipboardList, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { ADMISSIONS, ADMISSION_STATUSES, type Admission, type AdmissionStatus } from "@/lib/eduvest/admissions-mock";
import { useLanguage } from "@/hooks/use-language";
import { getAllWorkspaces, getLevels } from "@/lib/eduvest/academic-levels";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/admissions")({
  head: () => ({ meta: [{ title: "Admissions — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard permission="students.view">
      <AdmissionsPage />
    </RoleGuard>
  ),
});

function statusCls(s: AdmissionStatus) {
  if (s === "Accepted") return "bg-primary-soft text-primary";
  if (s === "Rejected") return "bg-destructive/10 text-destructive";
  if (s === "Waitlist") return "bg-amber-100 text-amber-700";
  if (s === "Under Review") return "bg-blue-100 text-blue-700";
  return "bg-secondary text-muted-foreground";
}

function AdmissionsPage() {
  const [list, setList] = useState<Admission[]>(ADMISSIONS);
  const [q, setQ] = useState("");
  const [showNew, setShowNew] = useState(false);

  const stats = useMemo(() => ({
    total: list.length,
    review: list.filter((a) => a.status === "Under Review" || a.status === "Submitted").length,
    accepted: list.filter((a) => a.status === "Accepted").length,
    rejected: list.filter((a) => a.status === "Rejected").length,
  }), [list]);

  const filtered = (s?: AdmissionStatus) => list
    .filter((a) => !s || a.status === s || (s === "Under Review" && a.status === "Submitted"))
    .filter((a) => !q || a.studentName.toLowerCase().includes(q.toLowerCase()) || a.parentName.toLowerCase().includes(q.toLowerCase()) || a.ref.toLowerCase().includes(q.toLowerCase()));

  const updateStatus = (id: string, status: AdmissionStatus) => setList((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admissions"
        description="Lightweight admissions workflow. Collects applications, lets staff review and issue a decision."
        actions={<Button variant="hero" size="sm" onClick={() => setShowNew(true)}><Plus className="h-4 w-4" /> New application</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Applications" value={stats.total} icon={ClipboardList} tone="primary" />
        <StatCard label="In review" value={stats.review} icon={Clock3} tone="warning" />
        <StatCard label="Accepted" value={stats.accepted} icon={CheckCircle2} tone="navy" />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} />
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search applications…" className="h-9 w-full rounded-full border border-border bg-secondary/40 pl-9 pr-4 text-sm outline-none focus:bg-background focus:border-primary" />
      </div>

      <Tabs defaultValue="applications">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="decision">Decision</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-4">
          <AdmissionTable rows={filtered()} onUpdate={updateStatus} />
        </TabsContent>
        <TabsContent value="review" className="mt-4">
          <AdmissionTable rows={filtered("Under Review")} onUpdate={updateStatus} />
        </TabsContent>
        <TabsContent value="status" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ADMISSION_STATUSES.map((s) => (
              <div key={s} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{s}</p>
                <p className="mt-1 text-2xl font-bold">{list.filter((a) => a.status === s).length}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="decision" className="mt-4">
          <AdmissionTable rows={filtered().filter((a) => a.status === "Accepted" || a.status === "Rejected" || a.status === "Waitlist")} onUpdate={updateStatus} />
        </TabsContent>
      </Tabs>

      {showNew && <NewAdmissionDialog onClose={() => setShowNew(false)} onCreate={(a) => { setList((p) => [a, ...p]); setShowNew(false); }} />}
    </div>
  );
}

function AdmissionTable({ rows, onUpdate }: { rows: Admission[]; onUpdate: (id: string, s: AdmissionStatus) => void }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="text-xs uppercase text-muted-foreground">
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left font-medium">Ref</th>
            <th className="px-4 py-3 text-left font-medium">Student</th>
            <th className="px-4 py-3 text-left font-medium">Parent</th>
            <th className="px-4 py-3 text-left font-medium">Preference</th>
            <th className="px-4 py-3 text-left font-medium">Fee</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Decision</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
              <td className="px-4 py-3 font-mono text-xs">{a.ref}</td>
              <td className="px-4 py-3 font-medium">{a.studentName}</td>
              <td className="px-4 py-3 text-muted-foreground">{a.parentName}<br /><span className="text-[11px]">{a.parentPhone}</span></td>
              <td className="px-4 py-3">{a.workspace} · {a.classPreference}</td>
              <td className="px-4 py-3"><span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest", a.feePaid ? "bg-primary-soft text-primary" : "bg-secondary text-muted-foreground")}>{a.feePaid ? "Paid" : "Unpaid"}</span></td>
              <td className="px-4 py-3"><span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest", statusCls(a.status))}>{a.status}</span></td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onUpdate(a.id, "Accepted")}>Accept</Button>
                  <Button variant="ghost" size="sm" onClick={() => onUpdate(a.id, "Rejected")}>Reject</Button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No applications.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function NewAdmissionDialog({ onClose, onCreate }: { onClose: () => void; onCreate: (a: Admission) => void }) {
  const { lang } = useLanguage();
  const [studentName, setStudentName] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [workspace, setWs] = useState("Primary");
  const [classPref, setClassPref] = useState("");
  const [feePaid, setFeePaid] = useState(false);
  const [note, setNote] = useState("");

  const submit = () => {
    onCreate({
      id: `a-${Date.now()}`,
      ref: `ADM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
      studentName, parentName, parentPhone, parentEmail,
      workspace, classPreference: classPref || getLevels(workspace, lang)[0] || "Class 1",
      feePaid, submittedAt: "Just now", status: "Submitted", note,
    });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New application</DialogTitle>
          <DialogDescription>Light intake form. Backend processing comes later.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <FieldInput label="Student name" value={studentName} onChange={setStudentName} />
          <FieldInput label="Parent name" value={parentName} onChange={setParentName} />
          <FieldInput label="Parent phone" value={parentPhone} onChange={setParentPhone} />
          <FieldInput label="Parent email" value={parentEmail} onChange={setParentEmail} />
          <FieldSelect label="Workspace" value={workspace} options={getAllWorkspaces()} onChange={(v) => { setWs(v); setClassPref(""); }} />
          <FieldSelect label="Class preference" value={classPref} options={getLevels(workspace, lang)} onChange={setClassPref} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={feePaid} onChange={(e) => setFeePaid(e.target.checked)} />
          Admission fee received
        </label>
        <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note" className="w-full rounded-xl border border-border bg-background p-3 text-sm" />
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="hero" size="sm" onClick={submit} disabled={!studentName || !parentName}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FieldInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm" />
    </label>
  );
}
function FieldSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm">
        <option value="">Select…</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
