import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { PARENTS } from "@/lib/eduvest/dashboard-mock";

export const Route = createFileRoute("/dashboard/parents")({
  head: () => ({ meta: [{ title: "Parents — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: ParentsPage,
});

function ParentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Parents"
        description={`${PARENTS.length} parent contacts.`}
        actions={<Button variant="hero" size="sm"><Plus className="h-4 w-4" /> Add parent</Button>}
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
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
            {PARENTS.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                <td className="px-4 py-3">{p.children.join(", ")}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.lastMessage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
