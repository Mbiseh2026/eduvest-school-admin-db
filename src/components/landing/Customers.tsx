import { CUSTOMERS } from "@/lib/eduvest/mock";
import { School, GraduationCap, Users, BookOpen } from "lucide-react";

const ICONS = [School, GraduationCap, Users, BookOpen];

export function Customers() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Built for everyone in the school</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            One platform. Four experiences.
          </h2>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CUSTOMERS.map((c, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={c.title}
                className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-elevated"
              >
                <Icon className="h-7 w-7 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
