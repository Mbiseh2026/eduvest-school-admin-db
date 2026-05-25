import { TESTIMONIALS } from "@/lib/eduvest/mock";
import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Loved by school leaders</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Stories from our early schools.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-soft"
            >
              <Quote className="h-7 w-7 text-primary" />
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-foreground">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
