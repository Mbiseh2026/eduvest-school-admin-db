import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, ClipboardList, CheckCircle2, Clock3, XCircle, Eye } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { ADMISSIONS, ADMISSION_STATUSES, admissionToStudent, type Admission, type AdmissionStatus } from "@/lib/eduvest/admissions-mock";
import { addStudent } from "@/lib/eduvest/students-store";
import { useLanguage } from "@/hooks/use-language";
import { useWorkspace } from "@/hooks/use-workspace";
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
  const { workspace } = useWorkspace();
  const isAll = workspace === "All School";
  const [allList, setAllList] = useState<Admission[]>(ADMISSIONS);
  const list = useMemo(
    () => (isAll ? allList : allList.filter((a) => a.workspace === workspace)),
    [allList, isAll, workspace],
  );
  const [q, setQ] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [reviewing, setReviewing] = useState<Admission | null>(null);

  const stats = useMemo(() => ({
    total: list.length,
    review: list.filter((a) => a.status === "Under Review" || a.status === "Submitted").length,
    accepted: list.filter((a) => a.status === "Accepted").length,
    rejected: list.filter((a) => a.status === "Rejected").length,
  }), [list]);

  const filtered = (s?: AdmissionStatus) => list
    .filter((a) => !s || a.status === s || (s === "Under Review" && a.status === "Submitted"))
    .filter((a) => !q || a.studentName.toLowerCase().includes(q.toLowerCase()) || a.parentName.toLowerCase().includes(q.toLowerCase()) || a.ref.toLowerCase().includes(q.toLowerCase()));

  const updateStatus = (id: string, status: AdmissionStatus) => {
    setAllList((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    if (status === "Accepted") {
      const a = allList.find((x) => x.id === id);
      if (a) addStudent(admissionToStudent({ ...a, status }));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admissions"
        description="Lightweight admissions workflow. Collect, review and issue a decision — accepted applications flow into Students automatically."
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
          <AdmissionTable rows={filtered()} onUpdate={updateStatus} onReview={setReviewing} />
        </TabsContent>
        <TabsContent value="review" className="mt-4">
          <AdmissionTable rows={filtered("Under Review")} onUpdate={updateStatus} onReview={setReviewing} showReason />
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
          <AdmissionTable rows={filtered().filter((a) => a.status === "Accepted" || a.status === "Rejected" || a.status === "Waitlist")} onUpdate={updateStatus} onReview={setReviewing} />
        </TabsContent>
      </Tabs>

      {showNew && <NewAdmissionDialog defaultWorkspace={isAll ? "Primary" : workspace} lockWorkspace={!isAll} onClose={() => setShowNew(false)} onCreate={(a) => { setAllList((p) => [a, ...p]); setShowNew(false); }} />}
      {reviewing && <ReviewDialog admission={reviewing} onClose={() => setReviewing(null)} onUpdate={(s) => { updateStatus(reviewing.id, s); setReviewing(null); }} />}
    </div>
  );
}

function AdmissionTable({ rows, onUpdate, onReview, showReason }: { rows: Admission[]; onUpdate: (id: string, s: AdmissionStatus) => void; onReview: (a: Admission) => void; showReason?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="text-xs uppercase text-muted-foreground">
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left font-medium">Ref</th>
            <th className="px-4 py-3 text-left font-medium">Student</th>
            <th className="px-4 py-3 text-left font-medium">Parent</th>
            <th className="px-4 py-3 text-left font-medium">Preference</th>
            {showReason && <th className="px-4 py-3 text-left font-medium">From / Reason</th>}
            <th className="px-4 py-3 text-left font-medium">Fee</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
              <td className="px-4 py-3 font-mono text-xs">{a.ref}</td>
              <td className="px-4 py-3 font-medium">{a.studentName}</td>
              <td className="px-4 py-3 text-muted-foreground">{a.parentName}<br /><span className="text-[11px]">{a.parentPhone}</span></td>
              <td className="px-4 py-3">{a.workspace} · {a.classPreference}</td>
              {showReason && (
                <td className="px-4 py-3 text-xs">
                  <div className="font-medium">{a.previousSchool || <span className="text-muted-foreground">—</span>}</div>
                  <div className="text-muted-foreground line-clamp-2">{a.reasonForChange || "—"}</div>
                </td>
              )}
              <td className="px-4 py-3"><span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest", a.feePaid ? "bg-primary-soft text-primary" : "bg-secondary text-muted-foreground")}>{a.feePaid ? "Paid" : "Unpaid"}</span></td>
              <td className="px-4 py-3"><span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest", statusCls(a.status))}>{a.status}</span></td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onReview(a)}><Eye className="h-3.5 w-3.5" /> Review</Button>
                  <Button variant="ghost" size="sm" onClick={() => onUpdate(a.id, "Accepted")}>Accept</Button>
                  <Button variant="ghost" size="sm" onClick={() => onUpdate(a.id, "Rejected")}>Reject</Button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={showReason ? 8 : 7} className="px-4 py-12 text-center text-sm text-muted-foreground">No applications.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ReviewDialog({ admission: a, onClose, onUpdate }: { admission: Admission; onClose: () => void; onUpdate: (s: AdmissionStatus) => void }) {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{a.studentName} — {a.ref}</DialogTitle>
          <DialogDescription>{a.workspace} · {a.classPreference} · {a.submittedAt}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <Info label="Date of birth" value={a.dob} />
          <Info label="Gender" value={a.gender} />
          <Info label="Nationality" value={a.nationality} />
          <Info label="Address" value={a.address} />
          <Info label="Parent" value={a.parentName} />
          <Info label="Parent phone" value={a.parentPhone} />
          <Info label="WhatsApp" value={a.whatsappSameAsPhone ? `${a.parentPhone} (same)` : a.whatsappPhone} />
          <Info label="Parent email" value={a.parentEmail} />
          <Info label="Previous / Incoming school" value={a.previousSchool} />
          <Info label="Fee status" value={a.feePaid ? "Paid" : "Unpaid"} />
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-700">Reason for transfer / school change</p>
          <p className="mt-1 text-amber-900">{a.reasonForChange || "Not provided by parent."}</p>
        </div>
        {a.note && <p className="text-sm text-muted-foreground"><span className="font-semibold">Note:</span> {a.note}</p>}
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onUpdate("Waitlist")}>Waitlist</Button>
          <Button variant="outline" size="sm" onClick={() => onUpdate("Rejected")}>Reject</Button>
          <Button variant="hero" size="sm" onClick={() => onUpdate("Accepted")}>Accept &amp; add to Students</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value || <span className="text-muted-foreground">—</span>}</p>
    </div>
  );
}

function NewAdmissionDialog({ onClose, onCreate, defaultWorkspace = "Primary", lockWorkspace = false }: { onClose: () => void; onCreate: (a: Admission) => void; defaultWorkspace?: string; lockWorkspace?: boolean }) {
  const { lang } = useLanguage();
  const [studentName, setStudentName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [waSame, setWaSame] = useState(true);
  const [waPhone, setWaPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [workspace, setWs] = useState(defaultWorkspace);
  const [classPref, setClassPref] = useState("");
  const [previousSchool, setPreviousSchool] = useState("");
  const [reasonForChange, setReasonForChange] = useState("");
  const [feePaid, setFeePaid] = useState(false);
  const [note, setNote] = useState("");

  const submit = () => {
    onCreate({
      id: `a-${Date.now()}`,
      ref: `ADM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
      studentName, parentName, parentPhone, parentEmail,
      workspace, classPreference: classPref || getLevels(workspace, lang)[0] || "Class 1",
      feePaid, submittedAt: "Just now", status: "Submitted", note,
      dob, gender: gender || undefined, previousSchool, reasonForChange,
      whatsappSameAsPhone: waSame, whatsappPhone: waSame ? parentPhone : waPhone,
    });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New application</DialogTitle>
          <DialogDescription>{lockWorkspace ? `Workspace: ${workspace}` : "Capture vital info now — additional details can be completed later."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <FieldInput label="Student name *" value={studentName} onChange={setStudentName} />
          <FieldInput label="Date of birth" type="date" value={dob} onChange={setDob} />
          <FieldSelect label="Gender" value={gender} options={["Male", "Female", "Other"]} onChange={(v) => setGender(v as "Male" | "Female" | "Other")} />
          {!lockWorkspace ? (
            <FieldSelect label="Workspace" value={workspace} options={getAllWorkspaces()} onChange={(v) => { setWs(v); setClassPref(""); }} />
          ) : <div />}
          <FieldSelect label="Class preference" value={classPref} options={getLevels(workspace, lang)} onChange={setClassPref} />
          <FieldInput label="Previous / Incoming school" value={previousSchool} onChange={setPreviousSchool} />
          <FieldInput label="Parent name *" value={parentName} onChange={setParentName} />
          <FieldInput label="Parent phone" value={parentPhone} onChange={setParentPhone} />
          <FieldInput label="Parent email" value={parentEmail} onChange={setParentEmail} />
        </div>

        <div className="rounded-xl border border-border bg-secondary/30 p-3 space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={waSame} onChange={(e) => setWaSame(e.target.checked)} />
            WhatsApp number is the same as parent phone
          </label>
          {!waSame && (
            <FieldInput label="WhatsApp number" value={waPhone} onChange={setWaPhone} />
          )}
        </div>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Reason for transfer / school change</span>
          <textarea rows={2} value={reasonForChange} onChange={(e) => setReasonForChange(e.target.value)} placeholder="Helps the school understand the new student" className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm" />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={feePaid} onChange={(e) => setFeePaid(e.target.checked)} />
          Admission fee received
        </label>
        <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note" className="w-full rounded-xl border border-border bg-background p-3 text-sm" />
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="hero" size="sm" onClick={submit} disabled={!studentName || !parentName}>Submit application</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FieldInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm" />
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
