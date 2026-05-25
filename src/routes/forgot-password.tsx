import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/eduvest/AuthShell";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — EduVest" },
      { name: "description", content: "Reset your EduVest password." },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a reset link.">
      {sent ? (
        <div className="rounded-2xl border border-primary/20 bg-primary-soft p-6 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
          <p className="mt-3 text-sm">If <strong>{email}</strong> exists, a reset link is on its way.</p>
          <Button asChild variant="link" className="mt-4">
            <Link to="/login">Back to sign in</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Work email</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" placeholder="you@school.com" />
          </label>
          <Button type="submit" variant="hero" size="lg" className="w-full">Send reset link</Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="font-semibold text-primary hover:underline">Back to sign in</Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
