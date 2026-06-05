import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Bell, Send, AlertTriangle, Filter } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MESSAGES, MESSAGE_TEMPLATES, PARENT_THREADS } from "@/lib/eduvest/dashboard-mock";
import { useStudents, getSubclasses } from "@/lib/eduvest/students-store";
import { useWorkspace } from "@/hooks/use-workspace";
import { getAllWorkspaces, getSectionLevels, detectSection, type AcademicSection } from "@/lib/eduvest/academic-levels";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/messages")({
  head: () => ({ meta: [{ title: "Messages — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: MessagesPage,
});

type SendBy = "Whole school" | "Class" | "Group" | "Individual";
type Channel = "SMS" | "Email" | "WhatsApp";
type Recipient = "Parents" | "Students" | "Both";
type FeesFilter = "" | "completed" | "started" | "notstarted";
type GenderFilter = "" | "Male" | "Female" | "Other";

function MessagesPage() {
  const { workspace: currentWs } = useWorkspace();
  const isAll = currentWs === "All School";
  const lockedWs = isAll ? null : currentWs;
  const students = useStudents();

  const [sendBy, setSendBy] = useState<SendBy>(lockedWs ? "Class" : "Whole school");
  const [workspace, setWorkspaceSel] = useState<string>(lockedWs ?? "");
  const [section, setSection] = useState<AcademicSection>("english");
  const [level, setLevel] = useState<string>("");
  const [division, setDivision] = useState<string>("");
  const [recipient, setRecipient] = useState<Recipient>("Parents");
  const [individual, setIndividual] = useState<string>("");
  const [channel, setChannel] = useState<Channel>("SMS");
  const [body, setBody] = useState("");

  // Extra "Group" filters
  const [feesFilter, setFeesFilter] = useState<FeesFilter>("");
  const [balanceMin, setBalanceMin] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("");

  const wsOptions = lockedWs ? [lockedWs] : getAllWorkspaces();
  const sendByOptions: SendBy[] = lockedWs ? ["Class", "Group", "Individual"] : ["Whole school", "Class", "Group", "Individual"];

  const sectionLevels = workspace ? getSectionLevels(workspace, section) : [];
  const subclasses = workspace && level ? getSubclasses(workspace, level) : [];

  // Audience computation against the actual Students store
  const audience = useMemo(() => {
    let rows = students;
    if (sendBy !== "Whole school" && workspace) rows = rows.filter((s) => s.workspace === workspace);

    if (sendBy === "Class") {
      if (level) rows = rows.filter((s) => s.level === level);
      if (division) rows = rows.filter((s) => (s.division ?? "") === division);
    }

    if (sendBy === "Group") {
      if (level) rows = rows.filter((s) => s.level === level);
      if (division) rows = rows.filter((s) => (s.division ?? "") === division);
      if (feesFilter === "completed") rows = rows.filter((s) => s.totalFees > 0 && s.paidFees >= s.totalFees);
      if (feesFilter === "started") rows = rows.filter((s) => s.paidFees > 0 && s.paidFees < s.totalFees);
      if (feesFilter === "notstarted") rows = rows.filter((s) => s.paidFees === 0);
      const minB = Number(balanceMin);
      if (!Number.isNaN(minB) && balanceMin !== "") rows = rows.filter((s) => s.totalFees - s.paidFees >= minB);
      if (genderFilter) rows = rows.filter((s) => s.gender === genderFilter);
    }

    if (sendBy === "Individual" && individual) {
      rows = rows.filter((s) => s.id === individual);
    }

    return rows;
  }, [students, sendBy, workspace, level, division, feesFilter, balanceMin, genderFilter, individual]);

  const audienceLabel = useMemo(() => {
    if (sendBy === "Whole school") return `Whole school · ${recipient}`;
    if (sendBy === "Individual") {
      const s = students.find((x) => x.id === individual);
      return s ? `Individual · ${s.name}` : "Individual · —";
    }
    const parts = [workspace || "—"];
    if (level) parts.push(level + (division ? ` ${division}` : ""));
    parts.push(recipient);
    return `${sendBy} · ${parts.join(" › ")}`;
  }, [sendBy, workspace, level, division, recipient, individual, students]);

  const historyRows = lockedWs ? MESSAGES.filter((m) => m.audience.includes(lockedWs) || m.audience === "Whole school") : MESSAGES;

  // Live class roster for the Classes tab — driven by students store
  const classRoster = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {};
    students.forEach((s) => {
      grouped[s.workspace] = grouped[s.workspace] || {};
      const key = s.division ? `${s.level} ${s.division}` : s.level;
      grouped[s.workspace][key] = (grouped[s.workspace][key] || 0) + 1;
    });
    return grouped;
  }, [students]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Reach parents, teachers and students. Filters are powered by the live Students list — fees, balance, gender, class and subclass."
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

              {/* Send by — the most important filter */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Send by</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sendByOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSendBy(s)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold",
                        sendBy === s ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter row */}
              <div className="grid gap-3 sm:grid-cols-2">
                {sendBy !== "Whole school" && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Workspace</label>
                    <select value={workspace} onChange={(e) => { setWorkspaceSel(e.target.value); setLevel(""); setDivision(""); }} disabled={!!lockedWs} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm disabled:opacity-70">
                      {!lockedWs && <option value="">Select…</option>}
                      {wsOptions.map((w) => <option key={w}>{w}</option>)}
                    </select>
                  </div>
                )}

                {(sendBy === "Class" || sendBy === "Group") && workspace && (
                  <>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Section</label>
                      <select value={section} onChange={(e) => { setSection(e.target.value as AcademicSection); setLevel(""); setDivision(""); }} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm">
                        <option value="english">English</option>
                        <option value="french">French</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Class</label>
                      <select value={level} onChange={(e) => { setLevel(e.target.value); setDivision(""); }} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm">
                        <option value="">All classes</option>
                        {sectionLevels.map((l) => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                    {level && (
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Subclass</label>
                        <select value={division} onChange={(e) => setDivision(e.target.value)} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm">
                          <option value="">All subclasses</option>
                          {subclasses.map((d) => <option key={d || "_none"} value={d}>{d ? `${level} ${d}` : "(none)"}</option>)}
                        </select>
                      </div>
                    )}
                  </>
                )}

                {sendBy !== "Individual" && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recipients</label>
                    <select value={recipient} onChange={(e) => setRecipient(e.target.value as Recipient)} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm">
                      {(["Parents", "Students", "Both"] as Recipient[]).map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                )}

                {sendBy === "Individual" && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Student / Parent</label>
                    <select value={individual} onChange={(e) => setIndividual(e.target.value)} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm">
                      <option value="">Select…</option>
                      {students
                        .filter((s) => !lockedWs || s.workspace === lockedWs)
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} — {s.parent} ({s.workspace} · {s.className || s.level})
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Group filters */}
              {sendBy === "Group" && (
                <div className="rounded-xl border border-dashed border-border p-3 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <Filter className="h-3.5 w-3.5" /> Group filters
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Fees status</label>
                      <select value={feesFilter} onChange={(e) => setFeesFilter(e.target.value as FeesFilter)} className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-2 text-xs">
                        <option value="">All</option>
                        <option value="completed">Completed</option>
                        <option value="started">Started</option>
                        <option value="notstarted">Not started</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Min balance (XAF)</label>
                      <input value={balanceMin} onChange={(e) => setBalanceMin(e.target.value)} placeholder="e.g. 50000" type="number" className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-2 text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Gender</label>
                      <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value as GenderFilter)} className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-2 text-xs">
                        <option value="">All</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-xl bg-primary-soft px-3 py-2 text-xs">
                <span className="font-semibold text-primary">Target: </span>
                <span className="text-primary/80">{audienceLabel}</span>
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">{audience.length} recipient{audience.length === 1 ? "" : "s"}</span>
              </div>

              {/* Audience preview */}
              {audience.length > 0 && sendBy !== "Whole school" && (
                <div className="max-h-32 overflow-y-auto rounded-xl border border-border p-2 text-xs">
                  <p className="mb-1 font-semibold text-muted-foreground">Preview</p>
                  <ul className="space-y-0.5">
                    {audience.slice(0, 12).map((s) => (
                      <li key={s.id} className="flex justify-between">
                        <span>{s.name} <span className="text-muted-foreground">— {s.className || s.level}</span></span>
                        <span className="text-muted-foreground">{recipient === "Students" ? "" : s.parent}</span>
                      </li>
                    ))}
                    {audience.length > 12 && <li className="text-muted-foreground">+ {audience.length - 12} more…</li>}
                  </ul>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message…" className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary" />
                <p className="mt-1 text-xs text-muted-foreground">{body.length} characters · {channel === "SMS" ? Math.ceil(body.length / 160) || 1 : 1} part</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Save draft</Button>
                <Button variant="hero" size="sm" disabled={channel === "WhatsApp" || audience.length === 0}>
                  <Send className="h-3.5 w-3.5" /> Send to {audience.length}
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

        <TabsContent value="classes" className="mt-4">
          <p className="mb-3 text-xs text-muted-foreground">Live roster — click a class to compose to it.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {wsOptions.map((w) => (
              <div key={w} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm font-semibold">{w}</p>
                <ul className="mt-2 space-y-1 text-xs">
                  {Object.entries(classRoster[w] || {}).length === 0 && (
                    <li className="text-muted-foreground">No students yet.</li>
                  )}
                  {Object.entries(classRoster[w] || {}).map(([cls, count]) => {
                    const [lvl, div] = cls.split(/\s+/, 2);
                    return (
                      <li key={cls}>
                        <button
                          className="flex w-full items-center justify-between rounded-lg border border-transparent px-2 py-1 hover:border-border hover:bg-secondary/40"
                          onClick={() => {
                            setSendBy("Class");
                            setWorkspaceSel(w);
                            setSection(detectSection(w, lvl));
                            setLevel(lvl);
                            setDivision(div || "");
                          }}
                        >
                          <span>· {cls}</span>
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" /> Class lists stay synced with the Students module.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
