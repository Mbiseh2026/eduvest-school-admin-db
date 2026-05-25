import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroDashboard from "@/assets/hero-dashboard.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-24 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            School ERP + Financial Intelligence
          </div>
          <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Run your school like a{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">modern business</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
            EduVest unifies admissions, attendance, finance, payroll, communication and AI into one
            beautifully simple workspace — built for African schools, ready for the world.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <Link to="/signup">
                Onboard your school <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/contact">Book a demo</Link>
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Free for your first term • No credit card required
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-5xl">
          <div className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-[2rem] bg-gradient-brand opacity-20 blur-3xl" />
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
            <img
              src={heroDashboard}
              alt="EduVest dashboard preview showing attendance trends, student lists and finance widgets"
              width={1600}
              height={1100}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
