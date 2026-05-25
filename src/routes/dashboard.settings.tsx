import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Palette,
  Languages,
  Bell,
  UsersRound,
  Shield,
  Smartphone,
  PlugZap,
  KeyRound,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRole } from "@/hooks/use-role";
import { ROLE_DESCRIPTIONS, ROLE_LABELS, type Role } from "@/lib/eduvest/roles";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "School Settings — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: SettingsPage,
});

const SECTIONS = [
  { icon: Building2, title: "School profile", desc: "Name, address, principal and contact details." },
  { icon: Palette, title: "Branding", desc: "Logo, colors and letterhead used across messages and IDs." },
  { icon: Languages, title: "Language", desc: "Switch between English and French — applies app-wide." },
  { icon: Bell, title: "Notifications", desc: "Choose when parents are notified about attendance and finance." },
  { icon: UsersRound, title: "Permissions", desc: "Assign roles to staff and review role-based access." },
  { icon: Smartphone, title: "Devices", desc: "Manage Gate App scanners and trusted admin devices." },
  { icon: PlugZap, title: "API integrations", desc: "Placeholders for accounting and payment provider keys." },
  { icon: Shield, title: "Security", desc: "Sessions, 2FA and audit logs — full controls land next phase." },
  { icon: KeyRound, title: "Recovery", desc: "Workspace recovery codes for school owners." },
];

const ROLES: Role[] = ["owner", "admin", "finance", "hr", "teacher", "parent", "student"];

function SettingsPage() {
  const { role, setRole } = useRole();
  return (
    <div className="space-y-6">
      <PageHeader
        title="School Settings"
        description="Configure the basics of your EduVest workspace."
      />

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold">Active role (preview)</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {ROLE_DESCRIPTIONS[role]} Switching here previews role-based access across the app.
            </p>
          </div>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
