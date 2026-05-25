import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Bell, Send, AlertTriangle } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MESSAGES, MESSAGE_TEMPLATES } from "@/lib/eduvest/dashboard-mock";

export const Route = createFileRoute("/dashboard/messages")({
  head: () => ({ meta: [{ title: "Messages — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  const [audience, setAudience] = useState("school-wide");
  const [channel, setChannel] = useState<"SMS" | "Email" | "Push">("SMS");
  const [body, setBody] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Reach parents, teachers and students. SMS, Email & Push are wired via partner APIs in the next phase."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sent (7d)" value="1,242" icon={Send} tone="primary" />
        <StatCard label="Pending" value="14" icon={Bell} tone="warning" />
        <StatCard label="Failed" value="3" icon={AlertTriangle} />
        <StatCard label="Templates" value={MESSAGE_TEMPLATES.length} icon={Mail} tone="navy" />
      </div>

      <Tabs defaultValue="compose">
        <TabsList>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Channel</label>
                  <div className="mt-2 flex gap-2">
                    {(["SMS", "Email", "Push"] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setChannel(c)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${channel === c ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
                  >
                    <option value="individual">Individual</option>
                    <option value="group">Group</option>
                    <option value="section">Section</option>
                    <option value="school-wide">School-wide</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your message…"
                  className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                />
                <p className="mt-1 text-xs text-muted-foreground">{body.length} characters · {channel === "SMS" ? Math.ceil(body.length / 160) || 1 : 1} part</p>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm">Save draft</Button>
                <Button variant="hero" size="sm">
                  <Send className="h-3.5 w-3.5" /> Send
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold">Quick templates</h3>
              <ul className="mt-3 space-y-2">
                {MESSAGE_TEMPLATES.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => setBody(t.body)}
                      className="w-full rounded-xl border border-border p-3 text-left transition-colors hover:border-primary"
                    >
                      <p className="text-sm font-medium">{t.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{t.body}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {MESSAGE_TEMPLATES.map((t) => (
              <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium">Channel</th>
                  <th className="px-4 py-3 text-left font-medium">Audience</th>
                  <th className="px-4 py-3 text-left font-medium">Subject</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Sent</th>
                </tr>
              </thead>
              <tbody>
                {MESSAGES.map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{m.channel}</td>
                    <td className="px-4 py-3">{m.audience}</td>
                    <td className="px-4 py-3">{m.subject}</td>
                    <td className={`px-4 py-3 ${m.status === "Sent" ? "text-primary" : m.status === "Pending" ? "text-amber-600" : "text-destructive"}`}>{m.status}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.sentAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="strategy" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold">Avoid spam</h3>
              <p className="mt-2 text-sm text-muted-foreground">EduVest auto-throttles broadcasts and respects parent preferences. Aim for purpose, not frequency.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold">Attendance cadence</h3>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li><span className="font-semibold text-foreground">Immediate:</span> Absence and late arrivals.</li>
                <li><span className="font-semibold text-foreground">Weekly:</span> Friday attendance summary.</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
