import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Save, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { TIMETABLE_DAYS, TIMETABLE_PERIODS, TIMETABLE_SAMPLE } from "@/lib/eduvest/dashboard-mock";

export const Route = createFileRoute("/dashboard/timetable")({
  head: () => ({ meta: [{ title: "Timetable — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: TimetablePage,
});

function TimetablePage() {
  const [grid, setGrid] = useState(TIMETABLE_SAMPLE);

  const set = (day: string, idx: number, subject: string) => {
    const key = `${day}-${idx}`;
    setGrid((g) => ({ ...g, [key]: subject ? { subject, teacher: g[key]?.teacher ?? "—" } : null }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable"
        description="Simple weekly builder. AI-assisted scheduling arrives later."
        actions={
          <>
            <Button variant="outline" size="sm"><Plus className="h-4 w-4" /> New class</Button>
            <Button variant="hero" size="sm"><Save className="h-4 w-4" /> Save</Button>
          </>
        }
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr className="border-b border-border">
              <th className="w-32 px-3 py-3 text-left font-medium">Period</th>
              {TIMETABLE_DAYS.map((d) => (
                <th key={d} className="px-3 py-3 text-left font-medium">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMETABLE_PERIODS.map((p, idx) => (
              <tr key={p} className="border-b border-border last:border-0">
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{p}</td>
                {TIMETABLE_DAYS.map((d) => {
                  const cell = grid[`${d}-${idx}`];
                  return (
                    <td key={d} className="px-2 py-2">
                      <input
                        value={cell?.subject ?? ""}
                        onChange={(e) => set(d, idx, e.target.value)}
                        placeholder="—"
                        className={`h-12 w-full rounded-lg border px-2 text-xs outline-none transition-colors focus:border-primary ${cell ? "border-primary/30 bg-primary-soft/40 font-medium" : "border-border bg-background"}`}
                      />
                      {cell?.teacher && cell?.subject && (
                        <p className="mt-0.5 px-1 text-[10px] text-muted-foreground">{cell.teacher}</p>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
