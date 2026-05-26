import { MODULES } from "@/lib/eduvest/mock";

export function Features() {
  return (
    <section id="features" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Products & Features</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            One platform. Two apps. Every workflow covered.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">
            The <span className="font-semibold text-foreground">Smart Attendance app</span> powers school
            administration. The <span className="font-semibold text-foreground">General app</span> serves
            parents, teachers and students with fees, lessons, savings, loans and insurance.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated"
              >
                {m.tag && (
                  <span
                    className={
                      "absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider " +
                      (m.tag === "ERP"
                        ? "bg-primary-soft text-primary"
                        : "bg-navy-soft text-navy")
                    }
                  >
                    {m.tag}
                  </span>
                )}
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-gradient-brand group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold">{m.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
