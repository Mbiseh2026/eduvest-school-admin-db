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

  // Header band
  doc.setFillColor(pr, pg, pb);
  doc.rect(0, 0, pageW, 30, "F");
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, 7, 16, 16, 2, 2, "F");
  doc.setTextColor(pr, pg, pb);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("EV", margin + 8, 17, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.text(school.name || "School", margin + 22, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const contact = [school.address, school.phone, school.email, school.website].filter(Boolean).join(" · ");
  if (contact) doc.text(contact, margin + 22, 21);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PAYSLIP", pageW - margin, 14, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Ref: ${record.reference}`, pageW - margin, 20, { align: "right" });
  doc.text(`Period: ${record.period}`, pageW - margin, 25, { align: "right" });

  // Employee block
  let y = 42;
  const colW = (pageW - margin * 2) / 2;
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, pageW - margin * 2, 28, "F");

  const lbl = (text: string, x: number, yy: number) => {
    doc.setTextColor(110, 110, 110);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(text, x, yy);
  };
  const val = (text: string, x: number, yy: number) => {
    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(text, x, yy);
  };

  lbl("EMPLOYEE", margin + 4, y + 5);
  val(record.teacherName, margin + 4, y + 11);
  lbl("EMPLOYEE ID", margin + 4, y + 17);
  val(record.teacherId.toUpperCase(), margin + 4, y + 23);

  lbl("POSITION", margin + 4 + colW, y + 5);
  val(record.position || record.department, margin + 4 + colW, y + 11);
  lbl("PAYMENT TYPE", margin + 4 + colW, y + 17);
  val(record.paymentType, margin + 4 + colW, y + 23);

  y += 36;

  // Hours table (if any)
  if (record.monthlyHours || record.hoursTaught) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text("Hours", margin, y);
    y += 4;
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, y, pageW - margin * 2, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text("Monthly hours", margin + 3, y + 4.8);
    doc.text("Hours taught", margin + 70, y + 4.8);
    doc.text("Rate", pageW - margin - 3, y + 4.8, { align: "right" });
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    doc.text(String(record.monthlyHours ?? "—"), margin + 3, y + 5);
    doc.text(String(record.hoursTaught ?? "—"), margin + 70, y + 5);
    doc.text(record.paymentType === "Hourly" ? "Per hour" : "—", pageW - margin - 3, y + 5, { align: "right" });
    doc.setDrawColor(235, 235, 235);
    doc.line(margin, y + 7.5, pageW - margin, y + 7.5);
    y += 12;
  }

  // Earnings & deductions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text("Earnings & Deductions", margin, y);
  y += 4;

  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y, pageW - margin * 2, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text("Item", margin + 3, y + 4.8);
  doc.text("Amount", pageW - margin - 3, y + 4.8, { align: "right" });
  y += 7;

  const rows: Array<[string, number, "credit" | "debit"]> = [
    ["Gross salary", record.gross, "credit"],
    ["Bonus", record.bonus, "credit"],
    ["Deductions", record.deduction, "debit"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  rows.forEach(([label, amount, kind]) => {
    doc.setTextColor(20, 20, 20);
    doc.text(label, margin + 3, y + 5);
    if (kind === "debit") doc.setTextColor(200, 60, 60);
    doc.text((kind === "debit" ? "- " : "") + money(amount), pageW - margin - 3, y + 5, { align: "right" });
    doc.setDrawColor(235, 235, 235);
    doc.line(margin, y + 7.5, pageW - margin, y + 7.5);
    y += 8;
  });

  // Net pay
  y += 5;
  doc.setFillColor(pr, pg, pb);
  doc.roundedRect(margin, y, pageW - margin * 2, 16, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("NET PAY", margin + 5, y + 10);
  doc.setFontSize(15);
  doc.text(money(record.net), pageW - margin - 5, y + 10.5, { align: "right" });
  y += 24;

  if (record.note) {
    doc.setTextColor(110, 110, 110);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("NOTE", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(9);
    doc.text(record.note, margin, y + 5, { maxWidth: pageW - margin * 2 });
    y += 14;
  }

  // Signatures
  y = Math.max(y, 230);
  doc.setDrawColor(160, 160, 160);
  doc.line(margin, y, margin + 70, y);
  doc.line(pageW - margin - 70, y, pageW - margin, y);
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text("Employee signature", margin, y + 4);
  doc.text("Administrator signature", pageW - margin - 70, y + 4);

  // Footer
  doc.setDrawColor(230, 230, 230);
  doc.line(margin, 282, pageW - margin, 282);
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 140);
  doc.text(`Generated ${record.generatedAt} · Ref ${record.reference}`, margin, 287);
  doc.text("Powered by EduVest — Smart Education Finance", pageW - margin, 287, { align: "right" });

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
