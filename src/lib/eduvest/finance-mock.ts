// Lightweight finance models — placeholder until accounting API integration.

export type IncomeSource =
  | "Tuition"
  | "Admission"
  | "Books"
  | "Uniforms"
  | "Transport"
  | "Other";

export type ExpenseCategory =
  | "Salaries"
  | "Transport"
  | "Card printing"
  | "Utilities"
  | "Supplies"
  | "Miscellaneous";

export type IncomeEntry = {
  id: string;
  source: IncomeSource;
  amount: number;
  date: string;
  reference: string;
};

export type ExpenseEntry = {
  id: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
};

export const INCOME_SOURCES: IncomeSource[] = [
  "Tuition",
  "Admission",
  "Books",
  "Uniforms",
  "Transport",
  "Other",
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Salaries",
  "Transport",
  "Card printing",
  "Utilities",
  "Supplies",
  "Miscellaneous",
];

export const INCOME_ENTRIES: IncomeEntry[] = [
  { id: "i1", source: "Tuition", amount: 1_450_000, date: "Today", reference: "INC-3201" },
  { id: "i2", source: "Books", amount: 85_000, date: "Today", reference: "INC-3202" },
  { id: "i3", source: "Uniforms", amount: 120_000, date: "Yesterday", reference: "INC-3198" },
  { id: "i4", source: "Tuition", amount: 980_000, date: "Yesterday", reference: "INC-3197" },
  { id: "i5", source: "Admission", amount: 250_000, date: "2 days ago", reference: "INC-3190" },
  { id: "i6", source: "Transport", amount: 60_000, date: "3 days ago", reference: "INC-3187" },
  { id: "i7", source: "Other", amount: 35_000, date: "This week", reference: "INC-3180" },
];

export const EXPENSE_ENTRIES: ExpenseEntry[] = [
  { id: "e1", category: "Salaries", amount: 9_400_000, date: "Last Friday", description: "Monthly payroll run" },
  { id: "e2", category: "Utilities", amount: 320_000, date: "This week", description: "Electricity + water" },
  { id: "e3", category: "Supplies", amount: 145_000, date: "Today", description: "Chalk, paper, markers" },
  { id: "e4", category: "Card printing", amount: 90_000, date: "Yesterday", description: "Student ID batch #4" },
  { id: "e5", category: "Transport", amount: 220_000, date: "3 days ago", description: "Bus fuel & maintenance" },
  { id: "e6", category: "Miscellaneous", amount: 48_000, date: "Last week", description: "Event refreshments" },
];

// Daily / Weekly / Monthly placeholders (XAF)
export const INCOME_TRENDS = {
  daily: 1_535_000,
  weekly: 6_240_000,
  monthly: 18_600_000,
  expDaily: 320_000,
  expWeekly: 2_140_000,
  expMonthly: 9_980_000,
  outstanding: 4_200_000,
};

// Secure QR token placeholder — backend issues + signs later.
export function generateQrToken(kind: "STU" | "STF", seed: string): string {
  const slug = seed.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase().padStart(6, "X");
  return `EVT_${kind}_TOKEN_${slug}`;
}
