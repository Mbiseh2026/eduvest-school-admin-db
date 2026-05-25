import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, MessageCircle, TrendingUp, AlertTriangle, FileBarChart, Wifi, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { useRole } from "@/hooks/use-role";
import { ROLE_LABELS } from "@/lib/eduvest/roles";

export const Route = createFileRoute("/dashboard/ai")({
  head: () => ({ meta: [{ title: "AI Insights — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard permission="ai.dashboard">
      <AiInsightsPage />
    </RoleGuard>
  ),
});

function AiInsightsPage() {
  const { role } = useRole();
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Insights"
        description="A preview of where EduVest AI is heading. No real models run yet — this is positioning and roadmap."
      />

      <section>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-navy-foreground"><MessageCircle className="h-3.5 w-3.5" /></span>
          <h2 className="text-base font-semibold">General App AI</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">For parents, teachers and students using the EduVest mobile companion.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Parent assistance", d: "Plain-language answers about fees, attendance and academic progress.", i: MessageCircle },
            { t: "Teacher support", d: "Lesson prep, grading helpers and parent-comms drafting.", i: Sparkles },
            { t: "Student guidance", d: "Homework explanations and study planning aligned with the curriculum.", i: Sparkles },
            { t: "Offline-first (future)", d: "On-device assistant for low-connectivity classrooms.", i: Wifi },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-border bg-card p-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><c.i className="h-5 w-5" /></span>
              <h3 className="mt-4 text-sm font-semibold">{c.t}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground"><TrendingUp className="h-3.5 w-3.5" /></span>
          <h2 className="text-base font-semibold">Dashboard AI</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">For school administrators. Operational, not generative.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {[
            { t: "Attendance trends", d: "Detects classes with deteriorating attendance and flags at-risk students.", i: TrendingUp, sample: "Form 5 attendance is down 6% over the last two weeks." },
            { t: "Finance observations", d: "Spots overdue clusters and suggests reminder cadences.", i: AlertTriangle, sample: "12 parents in Primary owe 2+ terms. Suggested SMS template ready." },
            { t: "School analytics", d: "A simple weekly digest of what changed and why it matters.", i: Sparkles, sample: "Enrollment grew 4% week-over-week, driven by Secondary." },
            { t: "Reports assistance", d: "Summaries and natural-language Q&A on uploaded reports.", i: FileBarChart, sample: "Annual Report 2024 — 3 risks and 5 wins to highlight." },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-navy/10 text-navy"><c.i className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">{c.t}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{c.d}</p>
                  <div className="mt-3 rounded-xl border border-dashed border-border bg-secondary/40 p-3 text-xs italic text-muted-foreground">
                    "{c.sample}"
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">
        Real AI is intentionally not enabled yet. The MVP focuses on attendance, messaging and financial transactions.
      </div>
    </div>
  );
}
