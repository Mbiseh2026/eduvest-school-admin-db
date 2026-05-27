import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer, QrCode, GraduationCap, Eye, ChevronRight, ArrowLeft, X } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { STUDENTS, TEACHERS, type Student, type Teacher } from "@/lib/eduvest/dashboard-mock";
import { generateQrToken } from "@/lib/eduvest/finance-mock";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useWorkspace } from "@/hooks/use-workspace";
import { useLanguage } from "@/hooks/use-language";
import { getAllWorkspaces, getLevels } from "@/lib/eduvest/academic-levels";
import { downloadIdCard, printIdCard, previewIdCard, type IdCardData } from "@/lib/eduvest/print-pdf";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/digital-id")({
  head: () => ({ meta: [{ title: "Digital ID — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: DigitalIdPage,
});

function DigitalIdPage() {
  const { state } = useOnboarding();
  const { workspace } = useWorkspace();
  const { lang } = useLanguage();
  const isAll = workspace === "All School";
  const lockedWs = isAll ? null : workspace;

  const [tab, setTab] = useState<"students" | "teachers">("students");
  const [pickedWs, setPickedWs] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const studentsScope = useMemo(
    () => (lockedWs ? STUDENTS.filter((s) => s.workspace === lockedWs) : STUDENTS),
    [lockedWs],
  );
  const teachersScope = useMemo(
    () => (lockedWs ? TEACHERS.filter((t) => t.workspace === lockedWs) : TEACHERS),
    [lockedWs],
  );

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(teachersScope[0] ?? null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const selectedWs = lockedWs ?? pickedWs;

  const school = {
    name: state.profile.schoolName || "Greenfield School",
    primaryColor: state.branding.primaryColor,
    phone: state.profile.phone || "+237 670 00 00 00",
  };

  const workspaces = useMemo(() => {
    if (lockedWs) return [lockedWs];
    const set = new Set<string>();
    studentsScope.forEach((s) => set.add(s.workspace));
    return Array.from(set);
  }, [studentsScope, lockedWs]);

  const classStudents = studentsScope.filter((s) => (!selectedWs || s.workspace === selectedWs) && (!selectedLevel || s.level === selectedLevel));

  const buildStudentCard = (s: Student): IdCardData => ({
    name: s.name,
    role: "Student",
    detail: `${s.workspace} · ${s.level}`,
    photo: s.photo,
    code: s.studentId,
    token: generateQrToken("STU", s.id),
    school,
    emergencyContact: s.parentPhone,
    schoolContact: school.phone,
  });

  const buildTeacherCard = (t: Teacher): IdCardData => ({
    name: t.name,
    role: "Teacher",
    detail: `${t.subject} · ${t.department}`,
    photo: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(t.name)}`,
    code: `STF-${t.id.toUpperCase()}`,
    token: generateQrToken("STF", t.id),
    school,
    emergencyContact: t.phone,
    schoolContact: school.phone,
  });

  const active = tab === "students" ? (selectedStudent ? buildStudentCard(selectedStudent) : null) : (selectedTeacher ? buildTeacherCard(selectedTeacher) : null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Digital ID"
        description="ID issuance for students and teachers. QR token only — no PII on the card itself."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadIdCard({
              name: "Sample Student",
              role: "Student",
              detail: "Secondary · Form 3",
              code: "SAMPLE-001",
              token: "EVT_STU_TOKEN_SAMPLE",
              school,
              emergencyContact: "+237 670 00 00 00",
              schoolContact: school.phone,
            })}
          >
            <Download className="h-4 w-4" /> Sample
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as "students" | "teachers")}>
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-4">
          <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
            {isAll ? (
              <button onClick={() => { setPickedWs(""); setSelectedLevel(""); setSelectedStudent(null); }} className="text-muted-foreground hover:text-foreground">All workspaces</button>
            ) : (
              <span className="font-semibold text-foreground">{workspace}</span>
            )}
            {isAll && selectedWs && (<><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /><button onClick={() => { setSelectedLevel(""); setSelectedStudent(null); }} className={cn("hover:text-foreground", selectedLevel ? "text-muted-foreground" : "font-semibold text-foreground")}>{selectedWs}</button></>)}
            {selectedLevel && (<><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /><span className="font-semibold">{selectedLevel}</span></>)}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div>
              {isAll && !selectedWs && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {workspaces.map((w) => (
                    <button key={w} onClick={() => setPickedWs(w)} className="rounded-2xl border border-border bg-card p-4 text-left hover:border-primary">
                      <p className="font-semibold">{w}</p>
                      <p className="text-xs text-muted-foreground">{studentsScope.filter((s) => s.workspace === w).length} students</p>
                    </button>
                  ))}
                </div>
              )}
              {selectedWs && !selectedLevel && (
                <div>
                  {isAll && (
                    <Button variant="ghost" size="sm" onClick={() => setPickedWs("")} className="mb-3"><ArrowLeft className="h-3.5 w-3.5" /> Back</Button>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {getLevels(selectedWs, lang).map((l) => (
                      <button key={l} onClick={() => setSelectedLevel(l)} className="rounded-2xl border border-border bg-card p-4 text-left hover:border-primary">
                        <p className="font-semibold">{l}</p>
                        <p className="text-xs text-muted-foreground">{studentsScope.filter((s) => s.workspace === selectedWs && s.level === l).length} students</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {selectedWs && selectedLevel && (
                <div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedLevel("")} className="mb-3"><ArrowLeft className="h-3.5 w-3.5" /> Back</Button>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {classStudents.map((s) => (
                      <button key={s.id} onClick={() => setSelectedStudent(s)} className={cn("flex items-center gap-3 rounded-2xl border bg-card p-3 text-left", selectedStudent?.id === s.id ? "border-primary" : "border-border hover:border-primary/40")}>
                        <img src={s.photo} alt={s.name} className="h-12 w-12 rounded-full border border-border" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{s.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{s.studentId}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {active && <IdCardPreview data={active} onPreview={() => setPreviewUri(previewIdCard(active))} />}
          </div>
        </TabsContent>

        <TabsContent value="teachers" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="grid gap-3 sm:grid-cols-2">
              {teachersScope.map((t) => (
                <button key={t.id} onClick={() => setSelectedTeacher(t)} className={cn("flex items-center gap-3 rounded-2xl border bg-card p-3 text-left", selectedTeacher?.id === t.id ? "border-primary" : "border-border hover:border-primary/40")}>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <GraduationCap className="h-5 w-5" />

                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.subject} · {t.department}</p>
                  </div>
                </button>
              ))}
            </div>
            {active && <IdCardPreview data={active} onPreview={() => setPreviewUri(previewIdCard(active))} />}
          </div>
        </TabsContent>
      </Tabs>

      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-5 text-xs text-muted-foreground">
        QR codes carry a secure token only — no name, class or phone number. The Gate App resolves the token against the backend to validate entry.
      </div>

      {previewUri && (
        <Dialog open onOpenChange={(o) => !o && setPreviewUri(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>ID card preview</span>
                <button onClick={() => setPreviewUri(null)}><X className="h-4 w-4" /></button>
              </DialogTitle>
            </DialogHeader>
            <div className="h-[70vh] w-full overflow-hidden rounded-xl border border-border bg-secondary">
              <iframe title="ID preview" src={previewUri} className="h-full w-full" />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function IdCardPreview({ data, onPreview }: { data: IdCardData; onPreview: () => void }) {
  return (
    <div className="space-y-3">
      {/* FRONT */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
        <div className="flex items-center justify-between bg-gradient-brand px-5 py-3 text-primary-foreground">
          <span className="text-xs font-bold uppercase tracking-widest">{data.school.name}</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest">{data.role}</span>
        </div>
        <div className="flex items-center gap-4 px-5 py-5">
          {data.photo ? (
            <img src={data.photo} alt={data.name} className="h-20 w-20 rounded-2xl border-2 border-primary/30 object-cover" />
          ) : (
            <span className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <GraduationCap className="h-7 w-7" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-base font-bold">{data.name}</p>
            <p className="truncate text-xs text-muted-foreground">{data.detail}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{data.code}</p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border bg-secondary/40 px-5 py-3">
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Front</div>
            <code className="block max-w-[180px] truncate font-mono text-[11px] text-foreground/80">{data.token}</code>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
            <QrCode className="h-10 w-10" />
          </div>
        </div>
      </div>

      {/* BACK */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="border-b border-border bg-secondary/40 px-5 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Back</div>
        <div className="space-y-3 px-5 py-4 text-xs">
          <Row label="Emergency contact" value={data.emergencyContact || "—"} />
          <Row label="School contact" value={data.schoolContact || "—"} />
          <Row label="ID number" value={data.code} />
          <p className="pt-2 text-[10px] text-muted-foreground">If found, please return to the issuing school. The QR is the only valid identifier.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onPreview}><Eye className="h-3.5 w-3.5" /> Preview</Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={() => downloadIdCard(data)}><Download className="h-3.5 w-3.5" /> Download</Button>
        <Button variant="hero" size="sm" className="flex-1" onClick={() => printIdCard(data)}><Printer className="h-3.5 w-3.5" /> Print</Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}
