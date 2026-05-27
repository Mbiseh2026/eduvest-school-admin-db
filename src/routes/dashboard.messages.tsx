import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Bell, Send, AlertTriangle } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MESSAGES, MESSAGE_TEMPLATES, PARENT_THREADS, PARENTS } from "@/lib/eduvest/dashboard-mock";
import { useLanguage } from "@/hooks/use-language";
import { useWorkspace } from "@/hooks/use-workspace";
import { getAllWorkspaces, getLevels } from "@/lib/eduvest/academic-levels";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/messages")({
  head: () => ({ meta: [{ title: "Messages — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: MessagesPage,
});

type Scope = "Whole school" | "Workspace" | "Class" | "Individual";
type Channel = "SMS" | "Email" | "WhatsApp";
type Recipient = "Parents" | "Students" | "Both";

function MessagesPage() {
  const { lang } = useLanguage();
  const { workspace: currentWs } = useWorkspace();
  const isAll = currentWs === "All School";
  const lockedWs = isAll ? null : currentWs;

  const [scope, setScope] = useState<Scope>(lockedWs ? "Workspace" : "Whole school");
  const [workspace, setWorkspaceSel] = useState<string>(lockedWs ?? "");
  const [level, setLevel] = useState<string>("");
  const [recipient, setRecipient] = useState<Recipient>("Parents");
  const [individual, setIndividual] = useState<string>("");
  const [channel, setChannel] = useState<Channel>("SMS");
  const [body, setBody] = useState("");

  const wsOptions = lockedWs ? [lockedWs] : getAllWorkspaces();
  const scopeOptions: Scope[] = lockedWs ? ["Workspace", "Class", "Individual"] : ["Whole school", "Workspace", "Class", "Individual"];
  const parentOptions = lockedWs ? PARENTS.filter((p) => p.workspace === lockedWs) : PARENTS;
  const historyRows = lockedWs ? MESSAGES.filter((m) => m.audience.includes(lockedWs) || m.audience === "Whole school") : MESSAGES;

  const target = useMemo(() => {
    if (scope === "Whole school") return "Whole school";
    if (scope === "Workspace") return `${workspace || "—"} › All › ${recipient}`;
    if (scope === "Class") return `${workspace || "—"} › ${level || "—"} › ${recipient}`;
    return `Individual › ${individual || "—"}`;
  }, [scope, workspace, level, recipient, individual]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Reach parents, teachers and students. SMS, Email and WhatsApp arrive via partner APIs in a later phase."
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
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2 space-y-4">
              {/* Channel */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Channel</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["SMS", "Email", "WhatsApp"] as Channel[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setChannel(c)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold",
                        channel === c ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {c}
                      {c === "WhatsApp" && <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700">Soon</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience cascade */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Scope</label>
                  <select value={scope} onChange={(e) => setScope(e.target.value as Scope)} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm">
                    {scopeOptions.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                {(scope === "Workspace" || scope === "Class") && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Workspace</label>
                    <select value={workspace} onChange={(e) => { setWorkspaceSel(e.target.value); setLevel(""); }} disabled={!!lockedWs} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm disabled:opacity-70">
                      {!lockedWs && <option value="">Select…</option>}
                      {wsOptions.map((w) => <option key={w}>{w}</option>)}
                    </select>
                  </div>
                )}
                {scope === "Class" && workspace && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Class</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value)} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm">
                      <option value="">Select…</option>
                      {getLevels(workspace, lang).map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                )}
                {scope !== "Individual" && scope !== "Whole school" && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recipients</label>
                    <select value={recipient} onChange={(e) => setRecipient(e.target.value as Recipient)} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm">
                      {(["Parents", "Students", "Both"] as Recipient[]).map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                )}
                {scope === "Individual" && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Person</label>
                    <select value={individual} onChange={(e) => setIndividual(e.target.value)} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm">
                      <option value="">Select parent…</option>
                      {parentOptions.map((p) => <option key={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-primary-soft px-3 py-2 text-xs">
                <span className="font-semibold text-primary">Target: </span>
                <span className="text-primary/80">{target}</span>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message…" className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary" />
                <p className="mt-1 text-xs text-muted-foreground">{body.length} characters · {channel === "SMS" ? Math.ceil(body.length / 160) || 1 : 1} part</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Save draft</Button>
                <Button variant="hero" size="sm" disabled={channel === "WhatsApp"}>
                  <Send className="h-3.5 w-3.5" /> Send
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold">Quick templates</h3>
                <ul className="mt-3 space-y-2">
                  {MESSAGE_TEMPLATES.map((t) => (
                    <li key={t.id}>
                      <button onClick={() => setBody(t.body)} className="w-full rounded-xl border border-border p-3 text-left transition-colors hover:border-primary">
                        <p className="text-sm font-medium">{t.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{t.body}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold">Parent threads</h3>
                <p className="mt-1 text-xs text-muted-foreground">Lightweight inbox — full chat ships later.</p>
                <ul className="mt-3 space-y-2">
                  {PARENT_THREADS.map((t) => (
                    <li key={t.id} className="rounded-xl border border-border p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{t.parent}</p>
                        {t.unread > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">{t.unread}</span>}
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{t.lastMessage}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{t.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
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
                  <th className="px-4 py-3 text-left font-medium">Target</th>
                  <th className="px-4 py-3 text-left font-medium">Subject</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Sent</th>
                </tr>
              </thead>
              <tbody>
                {historyRows.map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{m.channel}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.audience}</td>
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

        <TabsContent value="classes" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {getAllWorkspaces().map((w) => (
              <div key={w} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm font-semibold">{w}</p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {getLevels(w, lang).map((l) => <li key={l}>· {l}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
