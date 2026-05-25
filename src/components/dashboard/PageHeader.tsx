import { type ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: "default" | "primary" | "navy" | "warning";
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary-soft text-primary"
      : tone === "navy"
        ? "bg-navy/10 text-navy"
        : tone === "warning"
          ? "bg-amber-100 text-amber-700"
          : "bg-secondary text-muted-foreground";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </div>
  );
}
