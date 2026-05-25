import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Filter, PiggyBank, TrendingUp } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/PageHeader";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  INCOME_ENTRIES,
  INCOME_SOURCES,
  INCOME_TRENDS,
  type IncomeSource,
} from "@/lib/eduvest/finance-mock";

export const Route = createFileRoute("/dashboard/income")({
  head: () => ({ meta: [{ title: "Income — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard permission="finance.view">
      <IncomePage />
    </RoleGuard>
  ),
});

function IncomePage() {
  const [filter, setFilter] = useState<IncomeSource | "All">("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      INCOME_ENTRIES.filter((e) =>
        (filter === "All" || e.source === filter) &&
        (query === "" || e.reference.toLowerCase().includes(query.toLowerCase())),
      ),
    [filter, query],
  );

  const bySource = useMemo(() => {
    const map = new Map<IncomeSource, number>();
    INCOME_ENTRIES.forEach((e) => map.set(e.source, (map.get(e.source) ?? 0) + e.amount));
    const total = [...map.values()].reduce((a, b) => a + b, 0);
    return INCOME_SOURCES.map((s) => ({
      source: s,
      amount: map.get(s) ?? 0,
      pct: total === 0 ? 0 : Math.round(((map.get(s) ?? 0) / total) * 100),
    }));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Income"
        description="Visibility-only ledger. Accounting API and reconciliation arrive in a later phase."
        actions={
          <>
            <Button variant="outline" size="sm">Export</Button>
            <Button variant="hero" size="sm">Record income</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Daily income" value={`XAF ${INCOME_TRENDS.daily.toLocaleString()}`} hint="So far today" icon={PiggyBank} tone="primary" />
        <StatCard label="Weekly income" value={`XAF ${INCOME_TRENDS.weekly.toLocaleString()}`} hint="This week" icon={TrendingUp} tone="navy" />
        <StatCard label="Monthly income" value={`XAF ${INCOME_TRENDS.monthly.toLocaleString()}`} hint="Month to date" icon={TrendingUp} />
        <StatCard label="Outstanding fees" value={`XAF ${INCOME_TRENDS.outstanding.toLocaleString()}`} hint="Awaiting collection" icon={ArrowUpRight} tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Tabs defaultValue="daily">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search reference"
                />
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 text-xs">
                <Filter className="ml-2 h-3 w-3 text-muted-foreground" />
                {(["All", ...INCOME_SOURCES] as Array<IncomeSource | "All">).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`rounded-lg px-2 py-1 transition ${filter === s ? "bg-primary-soft text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium">Ref</th>
                    <th className="px-4 py-3 text-left font-medium">Source</th>
                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr key={e.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-mono text-xs">{e.reference}</td>
                      <td className="px-4 py-3">{e.source}</td>
                      <td className="px-4 py-3 text-right font-semibold text-primary">XAF {e.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">No entries match the filter.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="mt-4">
            <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
              Weekly view — aggregates from the same ledger once the accounting API is wired.
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="mt-4">
            <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
              Monthly view — month-over-month deltas land with the accounting API.
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold">Source breakdown</h3>
            <p className="text-xs text-muted-foreground">Share of income by source.</p>
            <ul className="mt-4 space-y-3">
              {bySource.map((s) => (
                <li key={s.source}>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{s.source}</span>
                    <span className="text-muted-foreground">XAF {s.amount.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-gradient-brand" style={{ width: `${s.pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-5">
            <h3 className="text-sm font-semibold">API Accounting</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Reserved placeholder for ledger sync and payment integration.
            </p>
            <Button variant="outline" size="sm" className="mt-3" disabled>
              Not connected
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
