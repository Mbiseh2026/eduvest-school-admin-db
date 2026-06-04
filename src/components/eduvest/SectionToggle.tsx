import { cn } from "@/lib/utils";
import type { AcademicSection } from "@/lib/eduvest/academic-levels";

export function SectionToggle({
  value,
  onChange,
  className,
}: {
  value: AcademicSection;
  onChange: (s: AcademicSection) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex gap-2", className)}>
      <button
        type="button"
        onClick={() => onChange("english")}
        className={cn(
          "rounded-xl border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition",
          value === "english"
            ? "border-primary bg-primary text-primary-foreground shadow-soft"
            : "border-border bg-background text-muted-foreground hover:border-primary",
        )}
      >
        English Section
      </button>
      <button
        type="button"
        onClick={() => onChange("french")}
        className={cn(
          "rounded-xl border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition",
          value === "french"
            ? "border-primary bg-primary text-primary-foreground shadow-soft"
            : "border-border bg-background text-muted-foreground hover:border-primary",
        )}
      >
        French Section
      </button>
    </div>
  );
}
