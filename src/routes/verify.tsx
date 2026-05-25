import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/eduvest/AuthShell";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [{ title: "Verify your email — EduVest" }],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  return (
    <AuthShell title="Verify your email" subtitle="Check your inbox for a verification link.">
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <MailCheck className="mx-auto h-12 w-12 text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">
          Verification will be wired up to backend in the next phase. For now you can continue.
        </p>
        <Button asChild variant="hero" size="lg" className="mt-6 w-full">
          <Link to="/onboarding">Continue</Link>
        </Button>
      </div>
    </AuthShell>
  );
}
