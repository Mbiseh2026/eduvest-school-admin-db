import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Logo } from "@/components/eduvest/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useOnboarding } from "@/hooks/use-onboarding";
import { ArrowRight, LogOut, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/hooks/use-workspace";


export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Select your workspace — EduVest" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WorkspacePage,
});

function WorkspacePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { state } = useOnboarding();
  const { setWorkspace } = useWorkspace();


  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (!user.onboarded) navigate({ to: "/onboarding" });
  }, [user, navigate]);

  const workspaces = useMemo(() => {
    const items = state.profile.schoolTypes.length
      ? state.profile.schoolTypes
      : (["Primary", "Secondary"] as const);
    return [...items, "All School"];
  }, [state.profile.schoolTypes]);

  const school = state.profile.schoolName || "Your School";

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={() => { signOut(); navigate({ to: "/" }); }}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </header>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-4 py-1.5 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Workspace ready
          </div>
          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Welcome to <span className="bg-gradient-brand bg-clip-text text-transparent">{school}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Choose a workspace to enter. Each one is a focused view tailored to that section of your school.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((w, i) => {
            const isAll = w === "All School";
            return (
              <button
                key={w}
                onClick={() => { setWorkspace(w); navigate({ to: "/dashboard" }); }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-card p-6 text-left transition-all hover:-translate-y-1 hover:shadow-elevated",
                  isAll ? "border-primary/40 bg-gradient-navy text-navy-foreground" : "border-border",
                )}
              >
                <div
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center rounded-xl",
                    isAll
                      ? "bg-white/15 text-white"
                      : "bg-primary-soft text-primary group-hover:bg-gradient-brand group-hover:text-primary-foreground",
                  )}
                >
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{w}</h3>
                <p className={cn("mt-1 text-sm", isAll ? "text-navy-foreground/70" : "text-muted-foreground")}>
                  {isAll
                    ? "A unified view across every section of the school."
                    : `Manage academics, attendance and finance for ${w}.`}
                </p>
                <span className={cn(
                  "mt-6 inline-flex items-center gap-1 text-sm font-semibold",
                  isAll ? "text-primary-foreground" : "text-primary",
                )}>
                  Enter workspace <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                {i === 0 && !isAll && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
                    <Sparkles className="h-3 w-3" /> Default
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center text-sm text-muted-foreground">
          Pick a workspace above to open its dashboard. You can switch workspaces anytime from the top bar.
          For now, your onboarding and architecture are ready. Want to tweak setup?{" "}
          <Link to="/onboarding" className="font-semibold text-primary hover:underline">Edit workspace</Link>
        </div>
      </div>
    </div>
  );
}
