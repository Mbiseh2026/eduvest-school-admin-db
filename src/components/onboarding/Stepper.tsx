import { ONBOARDING_STEPS } from "@/lib/eduvest/mock";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({ current, onJump }: { current: number; onJump: (s: number) => void }) {
  return (
    <ol className="space-y-1">
      {ONBOARDING_STEPS.map((s) => {
        const isDone = s.id < current;
        const isActive = s.id === current;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => isDone && onJump(s.id)}
              disabled={!isDone}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                isActive && "bg-primary-soft text-primary",
                isDone && "text-foreground hover:bg-secondary",
                !isActive && !isDone && "text-muted-foreground",
                !isDone && !isActive && "cursor-not-allowed",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  isActive && "bg-gradient-brand text-primary-foreground shadow-brand",
                  isDone && "bg-primary text-primary-foreground",
                  !isActive && !isDone && "border border-border bg-background",
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : s.id}
              </span>
              <span className="font-medium">{s.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export function MobileStepper({ current }: { current: number }) {
  const total = ONBOARDING_STEPS.length;
  const step = ONBOARDING_STEPS[current - 1];
  const pct = (current / total) * 100;
  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Step {current} of {total}</span>
        <span className="font-medium text-foreground">{step.label}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-gradient-brand transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
