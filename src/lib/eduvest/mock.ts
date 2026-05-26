import {
  BookOpen,
  CalendarCheck,
  IdCard,
  Wallet,
  PiggyBank,
  CalendarRange,
  Sparkles,
  Users,
  MessageSquare,
  FileBarChart,
  GraduationCap,
  HandCoins,
  ShieldCheck,
  Landmark,
  type LucideIcon,
} from "lucide-react";

export type ModuleItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  tag?: "ERP" | "General App";
};

export const MODULES: ModuleItem[] = [
  { title: "Admissions", description: "Streamline applications, screening and enrollment from one place.", icon: BookOpen, tag: "ERP" },
  { title: "Attendance", description: "Biometric & QR-ready attendance with daily and trend analytics.", icon: CalendarCheck, tag: "ERP" },
  { title: "Digital ID", description: "Issue secure digital identities for students, staff and parents.", icon: IdCard, tag: "ERP" },
  { title: "Payroll", description: "Run staff payroll with deductions, payslips and salary disbursement.", icon: Wallet, tag: "ERP" },
  { title: "Finance", description: "Fees, expenses, invoices and live cash-flow intelligence.", icon: PiggyBank, tag: "ERP" },
  { title: "Timetable", description: "Build, share and auto-resolve conflicts across sections and streams.", icon: CalendarRange, tag: "ERP" },
  { title: "AI", description: "Informational AI assistant for school authorities and stakeholders.", icon: Sparkles, tag: "ERP" },
  { title: "HR", description: "Staff records, leave, contracts and performance in one workspace.", icon: Users, tag: "ERP" },
  { title: "Communication", description: "Reach parents and staff via in-app, SMS and email channels.", icon: MessageSquare, tag: "ERP" },
  { title: "Reports", description: "Beautiful, exportable reports for academics, finance and operations.", icon: FileBarChart, tag: "ERP" },
  { title: "Lessons Marketplace", description: "Parents book verified tutors; teachers earn from private lessons.", icon: GraduationCap, tag: "General App" },
  { title: "Savings", description: "Goal-based savings for parents, students and staff inside the app.", icon: PiggyBank, tag: "General App" },
  { title: "Emergency Loans", description: "Trust-score backed micro-loans for fees, salaries and school needs.", icon: HandCoins, tag: "General App" },
  { title: "Insurance", description: "Light insurance products tailored to learners, staff and schools.", icon: ShieldCheck, tag: "General App" },
  { title: "Salary & Fee Rails", description: "Pay fees, receive salary, settle rent — all through one wallet.", icon: Landmark, tag: "General App" },
];

export const CUSTOMERS = [
  { title: "Schools", description: "From single campuses to multi-campus networks." },
  { title: "Teachers", description: "Tools that respect time and amplify impact in the classroom." },
  { title: "Parents", description: "Real-time visibility into learning, attendance and payments." },
  { title: "Students", description: "A digital identity and a smarter learning companion." },
];

export const PRICING = [
  {
    name: "Starter",
    price: "Free",
    period: "for 1 term",
    description: "For small schools getting started with digital operations.",
    features: ["Up to 150 students", "Attendance & Communication", "Email support", "Basic reports"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Standard",
    price: "$0.60",
    period: "/ student / month",
    description: "Everything schools need to run academics and finance.",
    features: ["Unlimited students", "Finance + Payroll", "Digital ID", "Priority support", "Advanced reports"],
    cta: "Start trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Multi-campus, custom integrations and dedicated success.",
    features: ["Multi-campus", "Custom integrations", "SSO", "Dedicated CSM", "On-prem options"],
    cta: "Talk to us",
    highlighted: false,
  },
];

export const TESTIMONIALS = [
  {
    quote: "EduVest brought our four campuses under one roof. Attendance and finance just work now.",
    name: "Mme. Adeline N.",
    role: "Proprietor, Greenfield Academy",
  },
  {
    quote: "What used to take a week of admin now takes a morning. Parents finally have visibility.",
    name: "Mr. Samuel K.",
    role: "Principal, Crescent High School",
  },
  {
    quote: "The dashboard tells us where money leaks before it becomes a problem. Game-changing.",
    name: "Mrs. Lillian B.",
    role: "Bursar, Sunrise Group of Schools",
  },
];

export const FAQS = [
  {
    q: "Is EduVest suitable for small schools?",
    a: "Yes. Starter is free for a full term and includes the essentials a 150-student school needs.",
  },
  {
    q: "Do you support both English and French?",
    a: "Yes. EduVest is a single architecture with a built-in EN/FR switcher — no separate systems.",
  },
  {
    q: "Can EduVest work in low-connectivity areas?",
    a: "We are building offline-first capabilities and an offline AI assistant on our roadmap.",
  },
  {
    q: "Is EduVest AI operational today?",
    a: "EduVest AI ships in informational mode at launch — guiding stakeholders. Operational AI features are rolling out next.",
  },
  {
    q: "How is my school data protected?",
    a: "Data is encrypted in transit and at rest, with role-based access and per-tenant isolation.",
  },
  {
    q: "Can we migrate from our current system?",
    a: "Yes. Our team helps you import students, staff, finance history and academic records.",
  },
];

export const SCHOOL_TYPES = [
  "Prenursery",
  "Nursery",
  "Primary",
  "Secondary",
  "High School",
  "High Institute",
  "University",
] as const;

export type SchoolType = (typeof SCHOOL_TYPES)[number];

export const ONBOARDING_STEPS = [
  { id: 1, key: "account", label: "Create account", short: "Account" },
  { id: 2, key: "profile", label: "School profile", short: "Profile" },
  { id: 3, key: "academic", label: "Academic structure", short: "Academic" },
  { id: 4, key: "branding", label: "Branding", short: "Branding" },
  { id: 5, key: "students", label: "Students & Parents", short: "Students" },
  { id: 6, key: "teachers", label: "Teachers & HR", short: "Teachers" },
  { id: 7, key: "timetable", label: "Timetable & Reports", short: "Timetable" },
  { id: 8, key: "finance", label: "Finance setup", short: "Finance" },
  { id: 9, key: "launch", label: "Launch workspace", short: "Launch" },
] as const;
