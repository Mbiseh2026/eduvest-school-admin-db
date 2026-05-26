import { Sparkles, Brain, Wifi } from "lucide-react";

export function AISection() {
  return (
    <section id="ai" className="relative overflow-hidden bg-navy py-20 text-navy-foreground sm:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-gradient-mesh" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            EduVest AI — Informational at launch
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            AI that understands schools, not just data.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-navy-foreground/80">
            EduVest AI ships first in informational mode — guiding stakeholders with clear,
            grounded answers. Operational AI (auto-tasks, automation) rolls out next.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur">
            <h3 className="text-lg font-semibold">In the General App</h3>
            <p className="mt-1 text-sm text-navy-foreground/70">For parents, teachers and students — works offline.</p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                "Parents — guidance on fees, attendance and child progress",
                "Teachers — lesson prep, summaries and grading aid",
                "Students — unlock academic mentors and homework help",
                "Offline mode — on-device AI when there's no internet",
              ].map((x) => (
                <li key={x} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur">
            <h3 className="text-lg font-semibold">In the Smart Attendance App (Dashboard)</h3>
            <p className="mt-1 text-sm text-navy-foreground/70">For school authorities and decision-makers.</p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                "Attendance trends across campuses and classes",
                "Finance observations and anomaly hints",
                "Trust-score insights for institutional loans",
                "Auto-generated reports for boards and parents",
              ].map((x) => (
                <li key={x} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/5 p-6">
            <Brain className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-semibold">Grounded, school-aware</h4>
              <p className="mt-1 text-sm text-navy-foreground/70">Answers stay within your school's context, language and policies.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/5 p-6">
            <Wifi className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-semibold">Future offline AI</h4>
              <p className="mt-1 text-sm text-navy-foreground/70">On our roadmap: an on-device AI that works without internet.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
