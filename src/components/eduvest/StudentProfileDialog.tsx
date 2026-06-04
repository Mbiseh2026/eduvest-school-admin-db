import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Heart, Users, GraduationCap, FileText, Wallet } from "lucide-react";
import { TEACHERS, type Student } from "@/lib/eduvest/dashboard-mock";

function Field({ label, value, icon: Icon }: { label: string; value?: string | number | null; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {value || <span className="text-muted-foreground">—</span>}
      </p>
    </div>
  );
}

export function StudentProfileDialog({
  student,
  onClose,
  onMessage,
  footerExtra,
}: {
  student: Student;
  onClose: () => void;
  onMessage?: () => void;
  footerExtra?: React.ReactNode;
}) {
  const bal = (student.totalFees ?? 0) - (student.paidFees ?? 0);
  const teachers = TEACHERS.filter((t) =>
    (t.assignedClasses ?? []).some(
      (c) =>
        c.workspace === student.workspace &&
        c.level === student.level &&
        (c.division ?? "") === (student.division ?? ""),
    ),
  );

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Student profile</DialogTitle>
          <DialogDescription>{student.studentId} · {student.workspace} · {student.className || student.level}</DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-4">
          <img src={student.photo} alt={student.name} className="h-24 w-24 rounded-2xl border border-border" />
          <div className="flex-1">
            <h3 className="text-xl font-bold">{student.name}</h3>
            <p className="text-sm text-muted-foreground">{student.gender || "—"} · {student.dob || "DOB not set"}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-widest">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">{student.registration}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">ID: {student.digitalId}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">
                Fees: {bal <= 0 ? "Paid" : student.paidFees > 0 ? "Partial" : "Outstanding"}
              </span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-2">
          <TabsList>
            <TabsTrigger value="overview"><Users className="h-3.5 w-3.5" /> Overview</TabsTrigger>
            <TabsTrigger value="family"><Users className="h-3.5 w-3.5" /> Family</TabsTrigger>
            <TabsTrigger value="health"><Heart className="h-3.5 w-3.5" /> Health</TabsTrigger>
            <TabsTrigger value="academic"><GraduationCap className="h-3.5 w-3.5" /> Academic</TabsTrigger>
            <TabsTrigger value="fees"><Wallet className="h-3.5 w-3.5" /> Fees</TabsTrigger>
            <TabsTrigger value="documents"><FileText className="h-3.5 w-3.5" /> Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Date of birth" value={student.dob} />
            <Field label="Gender" value={student.gender} />
            <Field label="Nationality" value={student.nationality} />
            <Field label="Religion" value={student.religion} />
            <Field label="Address" value={student.address} icon={MapPin} />
            <Field label="Previous school" value={student.previousSchool} />
            <Field label="Attendance" value={`${student.attendance}%`} />
            <Field label="Status" value={student.status} />
          </TabsContent>

          <TabsContent value="family" className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Mother" value={student.motherName} />
            <Field label="Mother phone" value={student.motherPhone} icon={Phone} />
            <Field label="Father" value={student.fatherName} />
            <Field label="Father phone" value={student.fatherPhone} icon={Phone} />
            <Field label="Parents' marital status" value={student.parentsMaritalStatus} />
            <Field label="Guardian" value={student.guardian} />
            <Field label="Guardian relation" value={student.guardianRelation} />
            <Field label="Primary contact email" value={student.parentEmail} icon={Mail} />
            <Field label="Emergency contact" value={student.emergencyContact} icon={Phone} />
          </TabsContent>

          <TabsContent value="health" className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Blood group" value={student.bloodGroup} />
            <Field label="Allergies" value={student.allergies} />
            <Field label="Conditions" value={student.conditions} />
            <Field label="Emergency contact" value={student.emergencyContact} icon={Phone} />
          </TabsContent>

          <TabsContent value="academic" className="mt-3 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Workspace" value={student.workspace} />
              <Field label="Class" value={student.className || student.level} />
              <Field label="Attendance" value={`${student.attendance}%`} />
              <Field label="Registration" value={student.registration} />
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Class teachers</p>
              {teachers.length === 0 ? (
                <p className="mt-1 text-sm text-muted-foreground">No teachers assigned to this class yet.</p>
              ) : (
                <ul className="mt-1 space-y-0.5 text-sm">
                  {teachers.map((t) => (
                    <li key={t.id}>
                      <span className="font-medium">{t.name}</span>{" "}
                      <span className="text-muted-foreground">— {t.subject} · {t.position}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Remarks history</p>
              {(student.remarks ?? []).length === 0 ? (
                <p className="mt-1 text-sm text-muted-foreground">No remarks recorded.</p>
              ) : (
                <ul className="mt-1 space-y-2 text-sm">
                  {(student.remarks ?? []).map((r) => (
                    <li key={r.id} className="rounded-lg bg-background p-2">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{r.date} · {r.teacher}</p>
                      <p>{r.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>

          <TabsContent value="fees" className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Total fees" value={`XAF ${(student.totalFees ?? 0).toLocaleString()}`} />
            <Field label="Paid" value={`XAF ${(student.paidFees ?? 0).toLocaleString()}`} />
            <Field label="Balance" value={bal > 0 ? `XAF ${bal.toLocaleString()}` : "Settled"} />
            <Field label="Status" value={bal <= 0 ? "Paid" : student.paidFees > 0 ? "Partial" : "Outstanding"} />
          </TabsContent>

          <TabsContent value="documents" className="mt-3">
            {(student.documents ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
            ) : (
              <ul className="space-y-2">
                {(student.documents ?? []).map((d, i) => (
                  <li key={i} className="rounded-xl border border-border bg-secondary/30 px-3 py-2 text-sm">
                    <a href={d.url} target="_blank" rel="noreferrer" className="text-primary underline">{d.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {footerExtra}
          {onMessage && (
            <Button variant="hero" size="sm" onClick={onMessage}>Message parent</Button>
          )}
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
