import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/eduvest/AuthShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your school workspace — EduVest" },
      { name: "description", content: "Onboard your school onto EduVest in minutes." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signUp({ fullName, email, password });
    setLoading(false);
    navigate({ to: "/onboarding" });
  };

  return (
    <AuthShell
      title="Create your school workspace"
      subtitle="Free for your first term. No credit card required."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Your full name">
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="auth-input" placeholder="Jane Doe" />
        </Field>
        <Field label="Work email">
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" placeholder="you@school.com" />
        </Field>
        <Field label="Password">
          <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" placeholder="At least 6 characters" />
        </Field>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          {loading ? "Creating workspace…" : "Continue to onboarding"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
