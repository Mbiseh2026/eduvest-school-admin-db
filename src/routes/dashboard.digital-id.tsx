import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer, QrCode, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { STUDENTS, TEACHERS } from "@/lib/eduvest/dashboard-mock";
import { useOnboarding } from "@/hooks/use-onboarding";

export const Route = createFileRoute("/dashboard/digital-id")({
  head: () => ({ meta: [{ title: "Digital ID — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: DigitalIdPage,
});

function DigitalIdPage() {
  const { state } = useOnboarding();
  const [selectedStudent, setSelected] = useState(STUDENTS[0]);

  const school = state.profile.schoolName || "Greenfield School";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Digital ID"
        description="Foundational ID issuance for students and teachers. Full QR logic ships with the Gate App."
      />

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="grid gap-3 sm:grid-cols-2">
              {STUDENTS.slice(0, 6).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`flex items-center gap-3 rounded-2xl border bg-card p-3 text-left transition-colors ${selectedStudent.id === s.id ? "border-primary" : "border-border hover:border-primary/40"}`}
                >
                  <img src={s.photo} alt={s.name} className="h-12 w-12 rounded-full border border-border" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{s.studentId} · {s.section}</p>
                  </div>
                </button>
              ))}
            </div>

            <IdCard
              name={selectedStudent.name}
              role="Student"
              detail={`${selectedStudent.section} · ${selectedStudent.className}`}
              photo={selectedStudent.photo}
              code={selectedStudent.studentId}
              school={school}
            />
          </div>
        </TabsContent>

        <TabsContent value="teachers" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="grid gap-3 sm:grid-cols-2">
              {TEACHERS.map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.subject} · {t.department}</p>
                  </div>
                </div>
              ))}
            </div>
            <IdCard
              name={TEACHERS[0].name}
              role="Teacher"
              detail={`${TEACHERS[0].subject} · ${TEACHERS[0].department}`}
              photo={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(TEACHERS[0].name)}`}
              code="STF-2025-001"
              school={school}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function IdCard({
  name,
  role,
  detail,
  photo,
  code,
  school,
}: {
  name: string;
  role: string;
  detail: string;
  photo: string;
  code: string;
  school: string;
}) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
        <div className="flex items-center justify-between bg-gradient-brand px-5 py-3 text-primary-foreground">
          <span className="text-xs font-bold uppercase tracking-widest">{school}</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest">{role}</span>
        </div>
        <div className="flex items-center gap-4 px-5 py-5">
          <img src={photo} alt={name} className="h-20 w-20 rounded-2xl border-2 border-primary/30 object-cover" />
          <div className="min-w-0">
            <p className="truncate text-base font-bold">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{detail}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{code}</p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border bg-secondary/40 px-5 py-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Valid this academic year
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
            <QrCode className="h-10 w-10" />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1"><Download className="h-3.5 w-3.5" /> Download</Button>
        <Button variant="hero" size="sm" className="flex-1"><Printer className="h-3.5 w-3.5" /> Print</Button>
      </div>
    </div>
  );
}
