import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, ChevronRight, ArrowLeft, MessageSquare, Phone, Mail } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PARENTS, type Parent } from "@/lib/eduvest/dashboard-mock";
import { useWorkspace } from "@/hooks/use-workspace";
import { useLanguage } from "@/hooks/use-language";
import { getLevels, getAllWorkspaces } from "@/lib/eduvest/academic-levels";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/parents")({
  head: () => ({ meta: [{ title: "Parents — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: ParentsPage,
});

function ParentsPage() {
  const navigate = useNavigate();
  const { workspace } = useWorkspace();
  const { lang } = useLanguage();

  const isAll = workspace === "All School";
  const lockedWs = isAll ? null : workspace;

  const [pickedWs, setPickedWs] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selected, setSelected] = useState<Parent | null>(null);

  const selectedWs = lockedWs ?? pickedWs;

  const scoped = useMemo(
    () => (lockedWs ? PARENTS.filter((p) => p.workspace === lockedWs) : PARENTS),
    [lockedWs],
  );

  const workspaces = useMemo(() => {
    if (lockedWs) return [lockedWs];
    const ws = new Set<string>();
    scoped.forEach((p) => ws.add(p.workspace));
    return Array.from(ws).filter((w) => getAllWorkspaces().includes(w) || w);
  }, [scoped, lockedWs]);

  const rows = useMemo(() => {
    let r = scoped;
    if (selectedWs) r = r.filter((p) => p.workspace === selectedWs);
    if (selectedLevel) r = r.filter((p) => p.level === selectedLevel);
    return r;
  }, [scoped, selectedWs, selectedLevel]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parents"
        description={
          selectedLevel
            ? `${rows.length} parent${rows.length === 1 ? "" : "s"} in ${selectedWs} · ${selectedLevel}`
            : selectedWs
              ? `${selectedWs} — pick a class.`
              : `${scoped.length} parent contacts.`
        }
        actions={<Button variant="hero" size="sm"><Plus className="h-4 w-4" /> Add parent</Button>}
      />

      <div className="flex flex-wrap items-center gap-2 text-sm">
        {isAll ? (
          <button onClick={() => { setPickedWs(""); setSelectedLevel(""); }} className="text-muted-foreground hover:text-foreground">All workspaces</button>
        ) : (
          <span className="font-semibold text-foreground">{workspace}</span>
        )}
        {isAll && selectedWs && (<><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /><button onClick={() => setSelectedLevel("")} className={cn("hover:text-foreground", selectedLevel ? "text-muted-foreground" : "font-semibold text-foreground")}>{selectedWs}</button></>)}
        {selectedLevel && (<><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /><span className="font-semibold">{selectedLevel}</span></>)}
      </div>

      {isAll && !selectedWs && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((w) => {
            const count = scoped.filter((p) => p.workspace === w).length;
            return (
              <button key={w} onClick={() => setPickedWs(w)} className="rounded-2xl border border-border bg-card p-5 text-left hover:border-primary">
                <p className="text-base font-semibold">{w}</p>
                <p className="mt-1 text-xs text-muted-foreground">{count} parent{count === 1 ? "" : "s"}</p>
              </button>
            );
          })}
        </div>
      )}

      {selectedWs && !selectedLevel && (
        <div>
          {isAll && (
            <Button variant="ghost" size="sm" onClick={() => setPickedWs("")} className="mb-3"><ArrowLeft className="h-3.5 w-3.5" /> All workspaces</Button>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {getLevels(selectedWs, lang).map((lvl) => {
              const count = scoped.filter((p) => p.workspace === selectedWs && p.level === lvl).length;
              return (
                <button key={lvl} onClick={() => setSelectedLevel(lvl)} className="rounded-2xl border border-border bg-card p-5 text-left hover:border-primary">
                  <p className="text-base font-semibold">{lvl}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{count} parent{count === 1 ? "" : "s"}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedWs && selectedLevel && (
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border p-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedLevel("")}><ArrowLeft className="h-3.5 w-3.5" /> Back</Button>
            <span className="text-xs text-muted-foreground">{rows.length} parent{rows.length === 1 ? "" : "s"}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Phone</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Children</th>
                  <th className="px-4 py-3 text-left font-medium">Last message</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} onClick={() => setSelected(p)} className="cursor-pointer border-b border-border last:border-0 hover:bg-secondary/40">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                    <td className="px-4 py-3">{p.children.join(", ")}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.lastMessage}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">No parents in this class.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <Dialog open onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selected.name}</DialogTitle>
              <DialogDescription>{selected.workspace} · {selected.level}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {selected.phone}</p>
              <p className="flex items-center gap-2 text-sm"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {selected.email}</p>
              <p className="text-sm"><span className="text-muted-foreground">Children:</span> {selected.children.join(", ")}</p>
              <p className="text-xs text-muted-foreground">Last activity — {selected.lastMessage}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setSelected(null)}>Close</Button>
              <Button variant="hero" size="sm" onClick={() => { setSelected(null); navigate({ to: "/dashboard/messages" }); }}>
                <MessageSquare className="h-3.5 w-3.5" /> Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
