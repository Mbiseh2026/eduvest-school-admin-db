import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/eduvest/AuthShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — EduVest" },
      { name: "description", content: "Sign in to your EduVest workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const u = await signIn({ email, password });
    setLoading(false);
    navigate({ to: u.onboarded ? "/workspace" : "/onboarding" });
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your EduVest workspace.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Work email">
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" placeholder="you@school.com" />
        </Field>
        <Field label="Password">
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" placeholder="••••••••" />
        </Field>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New to EduVest?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">Create an account</Link>
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
