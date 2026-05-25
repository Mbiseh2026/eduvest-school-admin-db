import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { useRole } from "@/hooks/use-role";
import type { Permission } from "@/lib/eduvest/roles";
import { ROLE_LABELS } from "@/lib/eduvest/roles";
import { Button } from "@/components/ui/button";

export function RoleGuard({
  permission,
  children,
}: {
  permission: Permission;
  children: ReactNode;
}) {
  const { role, can } = useRole();
  if (can(permission)) return <>{children}</>;

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card p-8 text-center">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <ShieldAlert className="h-5 w-5" />
      </span>
      <h2 className="mt-4 text-base font-semibold">Restricted area</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Your current role —{" "}
        <span className="font-medium text-foreground">{ROLE_LABELS[role]}</span> — doesn’t include access to this section.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-5">
        <Link to="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
