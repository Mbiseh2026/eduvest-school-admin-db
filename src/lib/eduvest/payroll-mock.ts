export type PaymentType = "Monthly" | "Hourly" | "Contract" | "Allowance";
export type PayrollStatus = "Paid" | "Pending" | "Processing";

export type PayrollRecord = {
  id: string;
  teacherId: string;
  teacherName: string;
  department: string;
  position?: string;
  paymentType: PaymentType;
  monthlyHours?: number;
  hoursTaught?: number;
  gross: number;
  bonus: number;
  deduction: number;
  net: number;
  period: string; // e.g. "May 2026"
  note?: string;
  status: PayrollStatus;
  generatedAt: string; // ISO date
  reference: string;
};

const ref = (i: number) => `PAY-${new Date().getFullYear()}-${String(i).padStart(4, "0")}`;

export const PAYROLL_RECORDS: PayrollRecord[] = [
  {
    id: "py1", teacherId: "t1", teacherName: "Mr. Emeka Obi", department: "Sciences", position: "Senior Teacher",
    paymentType: "Monthly", monthlyHours: 80, hoursTaught: 78,
    gross: 320000, bonus: 25000, deduction: 15000, net: 330000,
    period: "May 2026", status: "Paid", generatedAt: "2026-05-25", reference: ref(1),
  },
  {
    id: "py2", teacherId: "t2", teacherName: "Mme. Aline Foka", department: "Languages", position: "Teacher",
    paymentType: "Monthly", monthlyHours: 70, hoursTaught: 70,
    gross: 280000, bonus: 10000, deduction: 8000, net: 282000,
    period: "May 2026", status: "Paid", generatedAt: "2026-05-25", reference: ref(2),
  },
  {
    id: "py3", teacherId: "t3", teacherName: "Mr. Samuel Kim", department: "Sciences", position: "Lab Teacher",
    paymentType: "Hourly", monthlyHours: 60, hoursTaught: 58,
    gross: 240000, bonus: 0, deduction: 5000, net: 235000,
    period: "May 2026", status: "Pending", generatedAt: "2026-05-25", reference: ref(3),
    note: "58 hours @ XAF 4,000",
  },
  {
    id: "py4", teacherId: "t4", teacherName: "Mrs. Lillian Boateng", department: "Humanities", position: "Teacher",
    paymentType: "Monthly", monthlyHours: 65, hoursTaught: 64,
    gross: 270000, bonus: 0, deduction: 12000, net: 258000,
    period: "May 2026", status: "Processing", generatedAt: "2026-05-25", reference: ref(4),
  },
  {
    id: "py5", teacherId: "t5", teacherName: "Mr. Ibrahim Sow", department: "Sciences", position: "Head of ICT",
    paymentType: "Contract", monthlyHours: 72, hoursTaught: 70,
    gross: 350000, bonus: 50000, deduction: 0, net: 400000,
    period: "May 2026", status: "Paid", generatedAt: "2026-05-25", reference: ref(5),
    note: "ICT lab setup — milestone 2",
  },
  {
    id: "py6", teacherId: "t1", teacherName: "Mr. Emeka Obi", department: "Sciences", position: "Senior Teacher",
    paymentType: "Allowance", monthlyHours: 0, hoursTaught: 0,
    gross: 30000, bonus: 0, deduction: 0, net: 30000,
    period: "May 2026", status: "Paid", generatedAt: "2026-05-25", reference: ref(6),
    note: "Exam invigilation",
  },
  {
    id: "py7", teacherId: "t1", teacherName: "Mr. Emeka Obi", department: "Sciences", position: "Senior Teacher",
    paymentType: "Monthly", monthlyHours: 80, hoursTaught: 80,
    gross: 320000, bonus: 0, deduction: 15000, net: 305000,
    period: "April 2026", status: "Paid", generatedAt: "2026-04-25", reference: "PAY-2026-0012",
  },
  {
    id: "py8", teacherId: "t2", teacherName: "Mme. Aline Foka", department: "Languages", position: "Teacher",
    paymentType: "Monthly", monthlyHours: 70, hoursTaught: 68,
    gross: 280000, bonus: 0, deduction: 8000, net: 272000,
    period: "April 2026", status: "Paid", generatedAt: "2026-04-25", reference: "PAY-2026-0013",
  },
];

export const PAYMENT_TYPES: PaymentType[] = ["Monthly", "Hourly", "Contract", "Allowance"];
