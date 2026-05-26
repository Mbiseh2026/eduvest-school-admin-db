import { School, GraduationCap, Users, BookOpen, type LucideIcon } from "lucide-react";

type Persona = {
  title: string;
  icon: LucideIcon;
  tagline: string;
  steps: string[];
};

const PERSONAS: Persona[] = [
  {
    title: "Parents",
    icon: Users,
    tagline: "How EduVest helps you",
    steps: [
      "Pay school fees & download receipts",
      "Track attendance & results in real time",
      "Book private lessons with verified tutors",
      "Save for your child's future",
    ],
  },
  {
    title: "Teachers",
    icon: GraduationCap,
    tagline: "How EduVest helps you",
    steps: [
      "List subjects & receive lesson bookings",
      "Get paid securely after each lesson",
      "Build a verified profile with reviews",
      "Receive school salary into your wallet",
    ],
  },
  {
    title: "Students",
    icon: BookOpen,
    tagline: "How EduVest helps you",
    steps: [
      "Book verified tutors & academic mentors",
      "Save pocket money & set learning goals",
      "Build a Trust Score for scholarships",
      "Offline AI study help — no internet needed",
    ],
  },
  {
    title: "Schools",
    icon: School,
    tagline: "How EduVest helps you",
    steps: [
      "Collect fees online with auto-reconciliation",
      "Smart attendance, payroll & reports",
      "Access institutional loans on Trust Score",
      "Communicate with every parent in one click",
    ],
  },
];

export function Customers() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Built for everyone in the school community
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            One platform. Four experiences. Real outcomes.
          </h2>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-elevated"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold leading-tight">{p.title}</h3>
                    <p className="text-xs text-muted-foreground">{p.tagline}</p>
                  </div>
                </div>
                <ol className="mt-5 space-y-3">
                  {p.steps.map((s, i) => (
                    <li key={s} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-[11px] font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <span className="text-foreground/90">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
