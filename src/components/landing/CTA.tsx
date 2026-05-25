import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-navy p-10 text-navy-foreground sm:p-14">
          <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-40" />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to bring your school into the new era?
              </h2>
              <p className="mt-3 max-w-lg text-navy-foreground/80">
                Set up your EduVest workspace in under 15 minutes. No card. No commitment.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button asChild variant="hero" size="xl">
                <Link to="/signup">Start onboarding <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
                <Link to="/contact">Talk to sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
