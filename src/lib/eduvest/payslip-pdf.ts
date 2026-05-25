import { jsPDF } from "jspdf";
import type { PayrollRecord } from "@/lib/eduvest/payroll-mock";

export type PayslipSchool = {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  primaryColor?: string; // hex e.g. "#16A34A"
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const money = (n: number) => `XAF ${n.toLocaleString()}`;

export function buildPayslip(record: PayrollRecord, school: PayslipSchool): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const [pr, pg, pb] = hexToRgb(school.primaryColor || "#16A34A");
  const pageW = 210;
  const margin = 16;

  // Header bar
  doc.setFillColor(pr, pg, pb);
  doc.rect(0, 0, pageW, 32, "F");

  // Logo placeholder square
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, 8, 16, 16, 2, 2, "F");
  doc.setTextColor(pr, pg, pb);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("EV", margin + 8, 18, { align: "center" });

  // School name + contacts
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(school.name || "School", margin + 22, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const contactLine = [school.address, school.phone, school.email, school.website]
    .filter(Boolean)
    .join(" · ");
  if (contactLine) doc.text(contactLine, margin + 22, 22);

  // Document title
  doc.setFontSize(9);
  doc.text("PAYSLIP", pageW - margin, 16, { align: "right" });
  doc.setFontSize(8);
  doc.text(`Ref: ${record.reference}`, pageW - margin, 22, { align: "right" });
  doc.text(`Period: ${record.period}`, pageW - margin, 27, { align: "right" });

  // Teacher block
  let y = 48;
  doc.setTextColor(110, 110, 110);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("EMPLOYEE", margin, y);
  doc.text("PAYMENT TYPE", pageW / 2, y);

  y += 6;
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(12);
  doc.text(record.teacherName, margin, y);
  doc.text(record.paymentType, pageW / 2, y);

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  doc.text(record.department, margin, y);
  doc.text(`Generated: ${record.generatedAt}`, pageW / 2, y);

  // Divider
  y += 8;
  doc.setDrawColor(230, 230, 230);
  doc.line(margin, y, pageW - margin, y);

  // Earnings + deductions table
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text("Earnings & Deductions", margin, y);

  y += 6;
  const rows: Array<[string, number, "credit" | "debit"]> = [
    ["Gross salary", record.gross, "credit"],
    ["Bonus", record.bonus, "credit"],
    ["Deductions", record.deduction, "debit"],
  ];

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setFillColor(247, 247, 247);
  doc.rect(margin, y, pageW - margin * 2, 7, "F");
  doc.setTextColor(110, 110, 110);
  doc.text("Item", margin + 3, y + 4.8);
  doc.text("Amount", pageW - margin - 3, y + 4.8, { align: "right" });
  y += 7;

  doc.setTextColor(20, 20, 20);
  rows.forEach(([label, amount, kind]) => {
    doc.text(label, margin + 3, y + 5);
    const display = (kind === "debit" ? "- " : "") + money(amount);
    if (kind === "debit") doc.setTextColor(200, 60, 60);
    doc.text(display, pageW - margin - 3, y + 5, { align: "right" });
    doc.setTextColor(20, 20, 20);
    doc.setDrawColor(240, 240, 240);
    doc.line(margin, y + 7.5, pageW - margin, y + 7.5);
    y += 8;
  });

  // Net pay box
  y += 4;
  doc.setFillColor(pr, pg, pb);
  doc.roundedRect(margin, y, pageW - margin * 2, 14, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("NET PAY", margin + 4, y + 9);
  doc.setFontSize(14);
  doc.text(money(record.net), pageW - margin - 4, y + 9.2, { align: "right" });
  y += 22;

  if (record.note) {
    doc.setTextColor(110, 110, 110);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Note", margin, y);
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(9);
    doc.text(record.note, margin, y + 5, { maxWidth: pageW - margin * 2 });
    y += 14;
  }

  // Signature
  y = Math.max(y, 230);
  doc.setDrawColor(180, 180, 180);
  doc.line(margin, y, margin + 60, y);
  doc.line(pageW - margin - 60, y, pageW - margin, y);
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text("Bursar signature", margin, y + 4);
  doc.text("Employee signature", pageW - margin - 60, y + 4);

  // Footer
  doc.setDrawColor(230, 230, 230);
  doc.line(margin, 282, pageW - margin, 282);
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(`Payroll reference ${record.reference}`, margin, 287);
  doc.text("Powered by EduVest", pageW - margin, 287, { align: "right" });

  return doc;
}

export function downloadPayslip(record: PayrollRecord, school: PayslipSchool) {
  const doc = buildPayslip(record, school);
  const safeName = record.teacherName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`payslip-${safeName}-${record.period.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}

export function previewPayslip(record: PayrollRecord, school: PayslipSchool): string {
  const doc = buildPayslip(record, school);
  return doc.output("datauristring");
}

export function printPayslip(record: PayrollRecord, school: PayslipSchool) {
  const doc = buildPayslip(record, school);
  const url = doc.output("bloburl");
  const w = window.open(url, "_blank");
  if (w) {
    w.addEventListener("load", () => w.print());
  }
}
