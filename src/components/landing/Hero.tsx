import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Wallet,
  GraduationCap,
  PiggyBank,
  HandCoins,
  CalendarCheck,
  IdCard,
  Users,
} from "lucide-react";
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
            School ERP + Financial Identity for Education
          </div>
          <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            One platform. Two apps.{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">A trust score for education</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
            EduVest gives schools a modern ERP and gives teachers, parents and students a financial
            identity — pay fees, receive salaries, book lessons, save, insure, and unlock emergency
            loans, all powered by a unified Trust Score.
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

        <div className="relative mx-auto mt-14 max-w-6xl">
          <div className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-[2rem] bg-gradient-brand opacity-20 blur-3xl" />
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_3fr_1fr]">
            {/* Left phone — General App */}
            <PhoneMock
              label="General App"
              sublabel="Parents · Teachers · Students"
              accent="from-primary to-primary/70"
              items={[
                { icon: Wallet, label: "Pay school fees", value: "₣ 45,000" },
                { icon: GraduationCap, label: "Book a lesson", value: "Math · Today" },
                { icon: PiggyBank, label: "Savings goal", value: "62%" },
                { icon: HandCoins, label: "Emergency loan", value: "Eligible" },
              ]}
              className="hidden lg:block"
            />

            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
              <img
                src={heroDashboard}
                alt="EduVest dashboard preview showing attendance trends, student lists and finance widgets"
                width={1600}
                height={1100}
                className="h-auto w-full"
              />
            </div>

            {/* Right phone — Smart Attendance App */}
            <PhoneMock
              label="Smart Attendance App"
              sublabel="School administration"
              accent="from-navy to-navy/70"
              items={[
                { icon: CalendarCheck, label: "Today's attendance", value: "94%" },
                { icon: IdCard, label: "QR check-ins", value: "1,248" },
                { icon: Users, label: "Active staff", value: "82" },
                { icon: Wallet, label: "Payroll ready", value: "Friday" },
              ]}
              className="hidden lg:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneMock({
  label,
  sublabel,
  accent,
  items,
  className = "",
}: {
  label: string;
  sublabel: string;
  accent: string;
  items: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mx-auto w-full max-w-[220px] rounded-[2rem] border border-border bg-card p-2 shadow-elevated">
        <div className="rounded-[1.6rem] border border-border bg-background p-3">
          <div className={`rounded-2xl bg-gradient-to-br ${accent} p-3 text-primary-foreground`}>
            <div className="text-[10px] font-semibold uppercase tracking-widest opacity-80">EduVest</div>
            <div className="mt-0.5 text-sm font-bold leading-tight">{label}</div>
            <div className="text-[10px] opacity-80">{sublabel}</div>
          </div>
          <ul className="mt-3 space-y-2">
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <li
                  key={it.label}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-2.5 py-2"
                >
                  <span className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Icon className="h-3 w-3" />
                    </span>
                    <span className="text-[11px] font-medium text-foreground">{it.label}</span>
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground">{it.value}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
