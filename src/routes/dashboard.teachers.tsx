import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { TEACHERS } from "@/lib/eduvest/dashboard-mock";

export const Route = createFileRoute("/dashboard/teachers")({
  head: () => ({ meta: [{ title: "Teachers & HR — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: TeachersPage,
});

function TeachersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers & HR"
        description="Lightweight HR — staff records, attendance and payroll placeholders."
        actions={<Button variant="hero" size="sm"><Plus className="h-4 w-4" /> Add teacher</Button>}
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Subject</th>
              <th className="px-4 py-3 text-left font-medium">Department</th>
              <th className="px-4 py-3 text-left font-medium">Phone</th>
              <th className="px-4 py-3 text-left font-medium">Attendance</th>
              <th className="px-4 py-3 text-left font-medium">Payroll</th>
            </tr>
          </thead>
          <tbody>
            {TEACHERS.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3">{t.subject}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.department}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.phone}</td>
                <td className="px-4 py-3">{t.attendance}%</td>
                <td className="px-4 py-3 font-semibold">{t.payroll}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
