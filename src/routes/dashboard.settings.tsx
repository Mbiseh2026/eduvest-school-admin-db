import { createFileRoute } from "@tanstack/react-router";
import { Building2, Palette, Languages, Bell, UsersRound, Shield } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "School Settings — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: SettingsPage,
});

const SECTIONS = [
  { icon: Building2, title: "School profile", desc: "Name, address, principal and contact details." },
  { icon: Palette, title: "Branding", desc: "Logo, colors and letterhead used across messages and IDs." },
  { icon: Languages, title: "Language", desc: "Switch between English and French — applies app-wide." },
  { icon: Bell, title: "Notifications", desc: "Choose when parents are notified about attendance and finance." },
  { icon: UsersRound, title: "User management", desc: "Invite staff, assign workspaces and manage roles." },
  { icon: Shield, title: "Security (placeholder)", desc: "2FA, session management and audit logs — coming next phase." },
];

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="School Settings"
        description="Configure the basics of your EduVest workspace."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <div key={s.title} className="rounded-2xl border border-border bg-card p-5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <s.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-sm font-semibold">{s.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
            <Button variant="outline" size="sm" className="mt-4">Manage</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
