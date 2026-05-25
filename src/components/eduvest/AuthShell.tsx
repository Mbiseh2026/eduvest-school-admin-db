import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/eduvest/Logo";
import authPattern from "@/assets/auth-pattern.jpg";
import { ShieldCheck, Sparkles, Wallet } from "lucide-react";

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col p-6 sm:p-10 lg:p-14">
        <Logo />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <Link to="/" className="underline">Terms</Link> and{" "}
          <Link to="/" className="underline">Privacy</Link>.
        </p>
      </div>
      <div className="relative hidden overflow-hidden bg-navy lg:block">
        <img
          src={authPattern}
          alt=""
          width={1200}
          height={1600}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/70 via-navy/40 to-primary/30" />
        <div className="relative flex h-full flex-col justify-between p-14 text-navy-foreground">
          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-foreground/80">
              EduVest Workspace
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight">
              School ERP meets Financial Intelligence.
            </h2>
            <p className="mt-3 text-navy-foreground/80">
              Everything your school needs to run, grow and thrive — in one beautiful platform.
            </p>
          </div>
          <ul className="space-y-3 text-sm">
            {[
              { Icon: Sparkles, t: "AI guidance for parents, teachers & students" },
              { Icon: Wallet, t: "Live finance intelligence across campuses" },
              { Icon: ShieldCheck, t: "Trusted digital identity for every student" },
            ].map(({ Icon, t }) => (
              <li key={t} className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur">
                <Icon className="h-4 w-4 text-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
