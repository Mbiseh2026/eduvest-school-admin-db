import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Wallet, PiggyBank, Receipt, TrendingUp } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { STUDENTS, TRANSACTIONS, type Transaction } from "@/lib/eduvest/dashboard-mock";
import { useWorkspace } from "@/hooks/use-workspace";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/finance")({
  head: () => ({ meta: [{ title: "Finance — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard permission="finance.view">
      <FinancePage />
    </RoleGuard>
  ),
});

function statusCls(s: Transaction["status"]) {
  if (s === "Paid") return "bg-primary-soft text-primary";
  if (s === "Partial") return "bg-amber-100 text-amber-700";
  return "bg-destructive/10 text-destructive";
}

function FinancePage() {
  const { workspace } = useWorkspace();
  const isAll = workspace === "All School";
  const [classFilter, setClassFilter] = useState<string>("");

  const txAll = useMemo(
    () => (isAll ? TRANSACTIONS : TRANSACTIONS.filter((t) => t.workspace === workspace)),
    [isAll, workspace],
  );
  const studentsScope = useMemo(
    () => (isAll ? STUDENTS : STUDENTS.filter((s) => s.workspace === workspace)),
    [isAll, workspace],
  );

  const totals = useMemo(() => {
    let total = 0, paid = 0;
    txAll.forEach((t) => { total += t.totalAmount; paid += t.paidAmount; });
    return { total, paid, balance: total - paid };
  }, [txAll]);

  const filtered = classFilter ? txAll.filter((t) => `${t.workspace}·${t.level}` === classFilter) : txAll;

  // Revenue per class, scoped to current workspace
  const revenueByClass = useMemo(() => {
    const map = new Map<string, { workspace: string; level: string; count: number; revenue: number; balance: number }>();
    studentsScope.forEach((s) => {
      const key = `${s.workspace}·${s.level}`;
      const entry = map.get(key) || { workspace: s.workspace, level: s.level, count: 0, revenue: 0, balance: 0 };
      entry.count += 1;
      entry.revenue += s.paidFees;
      entry.balance += s.totalFees - s.paidFees;
      map.set(key, entry);
    });
    return Array.from(map.entries()).sort((a, b) => b[1].revenue - a[1].revenue);
  }, [studentsScope]);


  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance"
        description={isAll ? "All workspaces — totals, balances and class revenue." : `${workspace} only — totals, balances and class revenue.`}
        actions={
          <>
            <Button variant="outline" size="sm">Export</Button>
            <Button variant="hero" size="sm">Record payment</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total invoiced" value={`XAF ${totals.total.toLocaleString()}`} hint="Term to date" icon={PiggyBank} tone="primary" />
        <StatCard label="Paid" value={`XAF ${totals.paid.toLocaleString()}`} hint={`${Math.round((totals.paid / Math.max(totals.total, 1)) * 100)}% collected`} icon={Receipt} tone="navy" />
        <StatCard label="Balance" value={`XAF ${totals.balance.toLocaleString()}`} hint="Outstanding" icon={Wallet} tone="warning" />
        <StatCard label="Transactions" value={txAll.length} hint="This month" icon={TrendingUp} />
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="revenue">Revenue per class</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4">
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex flex-wrap items-center gap-2 border-b border-border p-3 text-xs">
              <span className="text-muted-foreground">Filter class:</span>
              <button onClick={() => setClassFilter("")} className={cn("rounded-full border px-2.5 py-1", classFilter === "" ? "border-primary text-primary" : "border-border text-muted-foreground")}>All</button>
              {Array.from(new Set(txAll.map((t) => `${t.workspace}·${t.level}`))).map((c) => (
                <button key={c} onClick={() => setClassFilter(c)} className={cn("rounded-full border px-2.5 py-1", classFilter === c ? "border-primary text-primary" : "border-border text-muted-foreground")}>{c.replace("·", " · ")}</button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium">Ref</th>
                    <th className="px-4 py-3 text-left font-medium">Student</th>
                    <th className="px-4 py-3 text-left font-medium">Class</th>
                    <th className="px-4 py-3 text-left font-medium">Category</th>
                    <th className="px-4 py-3 text-right font-medium">Total</th>
                    <th className="px-4 py-3 text-right font-medium">Paid</th>
                    <th className="px-4 py-3 text-right font-medium">Balance</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => {
                    const bal = t.totalAmount - t.paidAmount;
                    return (
                      <tr key={t.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                        <td className="px-4 py-3 font-mono text-xs">{t.ref}</td>
                        <td className="px-4 py-3 font-medium">{t.student}</td>
                        <td className="px-4 py-3 text-muted-foreground">{t.workspace} · {t.level}</td>
                        <td className="px-4 py-3 text-muted-foreground">{t.category}</td>
                        <td className="px-4 py-3 text-right">XAF {t.totalAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">XAF {t.paidAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-semibold">{bal > 0 ? `XAF ${bal.toLocaleString()}` : "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${statusCls(t.status)}`}>{t.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {revenueByClass.map(([key, d]) => (
              <div key={key} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{d.workspace}</p>
                <p className="mt-1 text-lg font-bold">{d.level}</p>
                <p className="mt-2 text-sm text-muted-foreground">{d.count} student{d.count === 1 ? "" : "s"}</p>
                <p className="mt-3 text-xl font-semibold">XAF {d.revenue.toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">Balance: XAF {d.balance.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
