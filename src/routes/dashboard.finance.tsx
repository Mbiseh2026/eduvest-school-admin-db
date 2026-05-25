import { createFileRoute } from "@tanstack/react-router";
import { Wallet, PiggyBank, Receipt, TrendingUp } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { TRANSACTIONS } from "@/lib/eduvest/dashboard-mock";

export const Route = createFileRoute("/dashboard/finance")({
  head: () => ({ meta: [{ title: "Finance — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard permission="finance.view">
      <FinancePage />
    </RoleGuard>
  ),
});

function FinancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance"
        description="Lightweight view. Full accounting and payment APIs ship in a later phase."
        actions={
          <>
            <Button variant="outline" size="sm">Export</Button>
            <Button variant="hero" size="sm">Record payment</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Fees collected" value="XAF 18.6M" hint="Term to date" icon={PiggyBank} tone="primary" />
        <StatCard label="Pending fees" value="XAF 4.2M" hint="63 invoices" icon={Receipt} tone="warning" />
        <StatCard label="Salary (placeholder)" value="XAF 9.4M" hint="Next run: Fri" icon={Wallet} tone="navy" />
        <StatCard label="Transactions" value="312" hint="This month" icon={TrendingUp} />
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="history">Payment history</TabsTrigger>
          <TabsTrigger value="revenue">Revenue summary</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4">
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium">Ref</th>
                  <th className="px-4 py-3 text-left font-medium">Student</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">Method</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{t.ref}</td>
                    <td className="px-4 py-3 font-medium">{t.student}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.method}</td>
                    <td className="px-4 py-3 text-right font-semibold">XAF {t.amount.toLocaleString()}</td>
                    <td className={`px-4 py-3 ${t.status === "Paid" ? "text-primary" : t.status === "Pending" ? "text-amber-600" : "text-destructive"}`}>{t.status}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
            Payment history per student. Connects to the same ledger once the payment APIs are wired.
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold">Monthly revenue (placeholder)</h3>
            <div className="mt-4 flex h-48 items-end gap-3">
              {[42, 55, 38, 64, 71, 58, 80, 76, 90, 84, 72, 95].map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t-md bg-gradient-brand" style={{ height: `${v}%` }} />
                  <span className="text-[10px] text-muted-foreground">{["J","F","M","A","M","J","J","A","S","O","N","D"][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
