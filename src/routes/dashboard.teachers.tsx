import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { TEACHERS } from "@/lib/eduvest/dashboard-mock";
import { classLabel } from "@/lib/eduvest/academic-levels";
import { useWorkspace } from "@/hooks/use-workspace";

export const Route = createFileRoute("/dashboard/teachers")({
  head: () => ({ meta: [{ title: "Teachers & HR — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: TeachersPage,
});

function TeachersPage() {
  const { workspace } = useWorkspace();
  const isAll = workspace === "All School";
  const rows = useMemo(
    () => (isAll ? TEACHERS : TEACHERS.filter((t) => t.workspace === workspace)),
    [isAll, workspace],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers & HR"
        description={isAll ? "All workspaces — staff records, monthly hours, attendance and payroll." : `${workspace} only — staff records and payroll.`}
        actions={<Button variant="hero" size="sm"><Plus className="h-4 w-4" /> Add teacher</Button>}
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Subject</th>
              <th className="px-4 py-3 text-left font-medium">Workspace</th>
              <th className="px-4 py-3 text-left font-medium">Department</th>
              <th className="px-4 py-3 text-left font-medium">Phone</th>
              <th className="px-4 py-3 text-left font-medium">Assigned classes</th>
              <th className="px-4 py-3 text-right font-medium">Monthly hours</th>
              <th className="px-4 py-3 text-right font-medium">Hours taught</th>
              <th className="px-4 py-3 text-right font-medium">Attendance hrs</th>
              <th className="px-4 py-3 text-right font-medium">Payroll</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3">{t.subject}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.workspace}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.department}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.phone}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(t.assignedClasses ?? []).map((c, i) => (
                      <span key={i} className="rounded-full bg-secondary px-2 py-0.5 text-[11px]">{classLabel(c.level, c.division)}</span>
                    ))}
                    {(!t.assignedClasses || t.assignedClasses.length === 0) && <span className="text-xs text-muted-foreground">—</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">{t.monthlyHours}</td>
                <td className="px-4 py-3 text-right">{t.hoursTaught}</td>
                <td className="px-4 py-3 text-right">{t.attendanceHours}</td>
                <td className="px-4 py-3 text-right font-semibold">{t.payroll}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={10} className="px-4 py-12 text-center text-sm text-muted-foreground">No teachers in this workspace yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
