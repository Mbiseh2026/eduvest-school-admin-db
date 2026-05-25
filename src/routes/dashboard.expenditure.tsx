import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Receipt, Wallet, TrendingDown } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/PageHeader";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_ENTRIES,
  INCOME_TRENDS,
  type ExpenseCategory,
  type ExpenseEntry,
} from "@/lib/eduvest/finance-mock";

export const Route = createFileRoute("/dashboard/expenditure")({
  head: () => ({ meta: [{ title: "Expenditure — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <RoleGuard permission="finance.view">
      <ExpenditurePage />
    </RoleGuard>
  ),
});

function ExpenditurePage() {
  const [entries, setEntries] = useState<ExpenseEntry[]>(EXPENSE_ENTRIES);
  const [query, setQuery] = useState("");

  const total = useMemo(() => entries.reduce((a, b) => a + b.amount, 0), [entries]);
  const filtered = useMemo(
    () =>
      entries.filter(
        (e) =>
          query === "" ||
          e.description.toLowerCase().includes(query.toLowerCase()) ||
          e.category.toLowerCase().includes(query.toLowerCase()),
      ),
    [entries, query],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenditure"
        description="Log school spending. Lightweight by design — no journals, no tax engine."
        actions={
          <RecordExpense
            onAdd={(e) => setEntries((prev) => [{ ...e, id: crypto.randomUUID() }, ...prev])}
          />
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Daily expenditure" value={`XAF ${INCOME_TRENDS.expDaily.toLocaleString()}`} icon={Receipt} tone="warning" />
        <StatCard label="Weekly expenditure" value={`XAF ${INCOME_TRENDS.expWeekly.toLocaleString()}`} icon={TrendingDown} />
        <StatCard label="Monthly expenditure" value={`XAF ${INCOME_TRENDS.expMonthly.toLocaleString()}`} icon={TrendingDown} tone="navy" />
        <StatCard label="All-time logged" value={`XAF ${total.toLocaleString()}`} hint={`${entries.length} entries`} icon={Wallet} />
      </div>

      <div className="space-y-3">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search description or category" />
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{e.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.description}</td>
                  <td className="px-4 py-3 text-right font-semibold">XAF {e.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">No matching expenses.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-dashed border-border bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Ledger Sync</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            When the accounting API is connected, expenses will sync to the school&apos;s ledger automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

function RecordExpense({ onAdd }: { onAdd: (e: Omit<ExpenseEntry, "id">) => void }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory>("Supplies");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("Today");
  const [description, setDescription] = useState("");

  const submit = () => {
    const n = Number(amount.replace(/[^0-9.]/g, ""));
    if (!n || !description.trim()) return;
    onAdd({ category, amount: n, date: date || "Today", description: description.trim() });
    setOpen(false);
    setAmount("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="sm"><Plus className="h-4 w-4" /> Log expense</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log expense</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Amount (XAF)</Label>
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="50000" inputMode="numeric" />
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Today" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="What was this for?" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="hero" onClick={submit}>Save expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
