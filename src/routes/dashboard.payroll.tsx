import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Wallet,
  CheckCircle2,
  Clock3,
  CircleDollarSign,
  Plus,
  Search,
  Eye,
  Download,
  Printer,
  X,
  FileText,
} from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PAYROLL_RECORDS,
  PAYMENT_TYPES,
  type PayrollRecord,
  type PaymentType,
  type PayrollStatus,
} from "@/lib/eduvest/payroll-mock";
import { TEACHERS } from "@/lib/eduvest/dashboard-mock";
import { downloadPayslip, previewPayslip, printPayslip } from "@/lib/eduvest/payslip-pdf";
import { useOnboarding } from "@/hooks/use-onboarding";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/payroll")({
  head: () => ({ meta: [{ title: "Payroll — EduVest" }, { name: "robots", content: "noindex" }] }),
  component: PayrollPage,
});

function PayrollPage() {
  const { state } = useOnboarding();
  const school = {
    name: state.profile.schoolName || "Greenfield School",
    address: state.profile.address,
    phone: state.profile.phone,
    email: state.profile.email,
    website: state.profile.website,
    primaryColor: state.branding.primaryColor,
  };

  const [records, setRecords] = useState<PayrollRecord[]>(PAYROLL_RECORDS);
  const [q, setQ] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [previewing, setPreviewing] = useState<PayrollRecord | null>(null);

  const currentPeriod = "May 2026";
  const currentRecords = records.filter((r) => r.period === currentPeriod);
  const history = records.filter((r) => r.period !== currentPeriod);

  const stats = useMemo(() => {
    const totalMonth = currentRecords.reduce((s, r) => s + r.net, 0);
    const paid = currentRecords.filter((r) => r.status === "Paid").length;
    const pending = currentRecords.filter((r) => r.status !== "Paid").length;
    const allPaid = pending === 0 && currentRecords.length > 0;
    return { totalMonth, paid, pending, allPaid };
  }, [currentRecords]);

  const filtered = (rows: PayrollRecord[]) =>
    rows.filter(
      (r) =>
        r.teacherName.toLowerCase().includes(q.toLowerCase()) ||
        r.reference.toLowerCase().includes(q.toLowerCase()),
    );

  const onCreate = (rec: PayrollRecord) => setRecords((prev) => [rec, ...prev]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll"
        description="Manage teacher salary records, generate payslips and prepare for future disbursement."
        actions={
          <Button variant="hero" size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> New payroll
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total payroll (this month)" value={`XAF ${stats.totalMonth.toLocaleString()}`} hint={currentPeriod} icon={CircleDollarSign} tone="primary" />
        <StatCard label="Teachers paid" value={stats.paid} hint={`of ${currentRecords.length}`} icon={CheckCircle2} tone="navy" />
        <StatCard label="Pending salaries" value={stats.pending} hint="Awaiting processing" icon={Clock3} tone="warning" />
        <StatCard label="Payroll status" value={stats.allPaid ? "Complete" : "In progress"} hint="Disbursement API soon" icon={Wallet} />
      </div>

      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Current run</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <div className="mt-3 flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search teacher or reference…"
              className="h-9 w-full rounded-full border border-border bg-secondary/40 pl-9 pr-4 text-sm outline-none focus:bg-background focus:border-primary"
            />
          </div>
        </div>

        <TabsContent value="current" className="mt-4">
          <PayrollTable
            rows={filtered(currentRecords)}
            onPreview={setPreviewing}
            onDownload={(r) => downloadPayslip(r, school)}
            onPrint={(r) => printPayslip(r, school)}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <PayrollTable
            rows={filtered(history)}
            onPreview={setPreviewing}
            onDownload={(r) => downloadPayslip(r, school)}
            onPrint={(r) => printPayslip(r, school)}
          />
        </TabsContent>
      </Tabs>

      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">
        MVP scope: salary records and payslip generation only. Actual salary transfers via fintech APIs ship in a later phase. No tax, pension or accounting engine is included.
      </div>

      {showCreate && (
        <CreatePayrollDialog
          onClose={() => setShowCreate(false)}
          onSubmit={(rec) => {
            onCreate(rec);
            setShowCreate(false);
          }}
        />
      )}

      {previewing && (
        <PayslipPreviewDialog
          record={previewing}
          school={school}
          onClose={() => setPreviewing(null)}
        />
      )}
    </div>
  );
}

function statusClass(s: PayrollStatus) {
  return s === "Paid"
    ? "bg-primary-soft text-primary"
    : s === "Pending"
      ? "bg-amber-100 text-amber-700"
      : "bg-secondary text-muted-foreground";
}

function PayrollTable({
  rows,
  onPreview,
  onDownload,
  onPrint,
}: {
  rows: PayrollRecord[];
  onPreview: (r: PayrollRecord) => void;
  onDownload: (r: PayrollRecord) => void;
  onPrint: (r: PayrollRecord) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="text-xs uppercase text-muted-foreground">
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left font-medium">Teacher</th>
            <th className="px-4 py-3 text-left font-medium">Department</th>
            <th className="px-4 py-3 text-left font-medium">Payment type</th>
            <th className="px-4 py-3 text-right font-medium">Gross</th>
            <th className="px-4 py-3 text-right font-medium">Net</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Payslip</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
              <td className="px-4 py-3">
                <div className="font-medium">{r.teacherName}</div>
                <div className="text-xs text-muted-foreground">{r.period} · {r.reference}</div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{r.department}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {r.paymentType}
                </span>
              </td>
              <td className="px-4 py-3 text-right">XAF {r.gross.toLocaleString()}</td>
              <td className="px-4 py-3 text-right font-semibold">XAF {r.net.toLocaleString()}</td>
              <td className="px-4 py-3">
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest", statusClass(r.status))}>
                  {r.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" /> Ready
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onPreview(r)}>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDownload(r)}>
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onPrint(r)}>
                    <Printer className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                No payroll records yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function CreatePayrollDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (record: PayrollRecord) => void;
}) {
  const [teacherId, setTeacherId] = useState(TEACHERS[0].id);
  const [paymentType, setPaymentType] = useState<PaymentType>("Monthly");
  const [gross, setGross] = useState<number>(280000);
  const [bonus, setBonus] = useState<number>(0);
  const [deduction, setDeduction] = useState<number>(0);
  const [note, setNote] = useState("");
  const [period, setPeriod] = useState("May 2026");

  const teacher = TEACHERS.find((t) => t.id === teacherId)!;
  const net = Math.max(0, gross + bonus - deduction);

  const submit = () => {
    const rec: PayrollRecord = {
      id: `py-${Date.now()}`,
      teacherId,
      teacherName: teacher.name,
      department: teacher.department,
      paymentType,
      gross,
      bonus,
      deduction,
      net,
      period,
      note: note || undefined,
      status: "Pending",
      generatedAt: new Date().toISOString().slice(0, 10),
      reference: `PAY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    };
    onSubmit(rec);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New payroll record</DialogTitle>
          <DialogDescription>Lightweight setup. No tax or statutory calculations are applied.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <Field label="Teacher">
            <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className="dlg-input">
              {TEACHERS.map((t) => (
                <option key={t.id} value={t.id}>{t.name} — {t.department}</option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Payment type">
              <select value={paymentType} onChange={(e) => setPaymentType(e.target.value as PaymentType)} className="dlg-input">
                {PAYMENT_TYPES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Payroll period">
              <input value={period} onChange={(e) => setPeriod(e.target.value)} className="dlg-input" placeholder="e.g. May 2026" />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Gross (XAF)">
              <input type="number" min={0} value={gross} onChange={(e) => setGross(Number(e.target.value) || 0)} className="dlg-input" />
            </Field>
            <Field label="Bonus (XAF)">
              <input type="number" min={0} value={bonus} onChange={(e) => setBonus(Number(e.target.value) || 0)} className="dlg-input" />
            </Field>
            <Field label="Deduction (XAF)">
              <input type="number" min={0} value={deduction} onChange={(e) => setDeduction(Number(e.target.value) || 0)} className="dlg-input" />
            </Field>
          </div>

          <Field label="Note (optional)">
            <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} className="dlg-input" placeholder="e.g. 60 hours @ XAF 4,000" />
          </Field>

          <div className="flex items-center justify-between rounded-xl bg-primary-soft px-4 py-3">
            <span className="text-sm font-medium text-primary">Net pay</span>
            <span className="text-lg font-bold text-primary">XAF {net.toLocaleString()}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} size="sm">Cancel</Button>
          <Button variant="hero" onClick={submit} size="sm">Create record</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PayslipPreviewDialog({
  record,
  school,
  onClose,
}: {
  record: PayrollRecord;
  school: Parameters<typeof previewPayslip>[1];
  onClose: () => void;
}) {
  const dataUri = useMemo(() => previewPayslip(record, school), [record, school]);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-3">
            <span>Payslip preview — {record.teacherName}</span>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </DialogTitle>
          <DialogDescription>{record.period} · {record.reference}</DialogDescription>
        </DialogHeader>
        <div className="h-[70vh] w-full overflow-hidden rounded-xl border border-border bg-secondary">
          <iframe title="Payslip preview" src={dataUri} className="h-full w-full" />
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => printPayslip(record, school)}>
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
          <Button variant="hero" size="sm" onClick={() => downloadPayslip(record, school)}>
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
