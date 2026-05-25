import { Target, Eye, Heart } from "lucide-react";

export function About() {
  const items = [
    { icon: Target, title: "Mission", body: "Equip every school with the tools, intelligence and trust to thrive in a digital economy." },
    { icon: Eye, title: "Vision", body: "An Africa where every learner has a digital identity and every school is financially intelligent." },
    { icon: Heart, title: "Why EduVest", body: "Because school software shouldn't feel like punishment — and finance shouldn't be a guess." },
  ];
  return (
    <section className="bg-navy-soft py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy">About EduVest</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            More than software. A platform for trust.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.title} className="rounded-2xl border border-border bg-card p-8 shadow-soft">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-navy text-navy-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
