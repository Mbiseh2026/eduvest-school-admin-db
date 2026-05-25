import { createFileRoute } from "@tanstack/react-router";
import { Download, Upload, FileText, Archive } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { REPORT_FILES } from "@/lib/eduvest/dashboard-mock";

export const Route = createFileRoute("/dashboard/reports")({
  head: () => ({ meta: [{ title: "Reports — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Upload, download and archive school documents. Report intelligence comes later."
        actions={<Button variant="hero" size="sm"><Upload className="h-4 w-4" /> Upload</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORT_FILES.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{r.type}</span>
            </div>
            <h3 className="mt-4 text-sm font-semibold">{r.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{r.size} · {r.date}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5" /> Download</Button>
              <Button variant="ghost" size="sm"><Archive className="h-3.5 w-3.5" /> Archive</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
