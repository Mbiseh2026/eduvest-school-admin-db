import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { STUDENTS } from "@/lib/eduvest/dashboard-mock";
import { useWorkspace } from "@/hooks/use-workspace";

export const Route = createFileRoute("/dashboard/students")({
  head: () => ({ meta: [{ title: "Students — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: StudentsPage,
});

function StudentsPage() {
  const { workspace } = useWorkspace();
  const [q, setQ] = useState("");

  const rows = STUDENTS.filter((s) => (workspace === "All School" ? true : s.section === workspace))
    .filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.studentId.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description={`${rows.length} student${rows.length === 1 ? "" : "s"} in ${workspace}.`}
        actions={
          <>
            <Button variant="outline" size="sm">Import CSV</Button>
            <Button variant="hero" size="sm"><Plus className="h-4 w-4" /> Add student</Button>
          </>
        }
      />

      <div className="rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border p-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or ID…"
              className="h-9 w-full rounded-full border border-border bg-secondary/40 pl-9 pr-4 text-sm outline-none focus:bg-background focus:border-primary"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium">Student</th>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Section</th>
                <th className="px-4 py-3 text-left font-medium">Class</th>
                <th className="px-4 py-3 text-left font-medium">Parent</th>
                <th className="px-4 py-3 text-left font-medium">Attendance</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={s.photo} alt={s.name} className="h-9 w-9 rounded-full border border-border" />
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{s.studentId}</td>
                  <td className="px-4 py-3">{s.section}</td>
                  <td className="px-4 py-3">{s.className}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.parent}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-gradient-brand" style={{ width: `${s.attendance}%` }} />
                      </div>
                      <span className="text-xs font-semibold">{s.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${s.status === "Active" ? "bg-primary-soft text-primary" : "bg-secondary text-muted-foreground"}`}>{s.status}</span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No students match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
