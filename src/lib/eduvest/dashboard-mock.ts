// Lightweight mock data for the EduVest dashboard MVP.
// Placeholder until backend integration.

export type Student = {
  id: string;
  name: string;
  photo: string;
  studentId: string;
  workspace: string; // e.g. "Primary", "Secondary"
  level: string; // English canonical level, e.g. "Form 3"
  section?: "Primary" | "Secondary" | "University"; // legacy
  className: string; // human friendly e.g. "Form 3 A"
  parent: string;
  parentId?: string;
  guardian?: string;
  parentPhone: string;
  parentEmail: string;
  attendance: number;
  status: "Active" | "Archived";
  registration: "Registered" | "Pending" | "Withdrawn";
  totalFees: number;
  paidFees: number;
  digitalId: "Issued" | "Pending";
};

export type Parent = {
  id: string;
  name: string;
  phone: string;
  email: string;
  workspace: string;
  level: string;
  children: string[];
  lastMessage: string;
};

export type Teacher = {
  id: string;
  name: string;
  subject: string;
  department: string;
  position: string;
  phone: string;
  workspace: string;
  attendance: number;
  payroll: string;
  monthlyHours: number;
  hoursTaught: number;
  attendanceHours: number;
};

export type Message = {
  id: string;
  channel: "SMS" | "Email" | "WhatsApp" | "Push";
  audience: string;
  subject: string;
  status: "Sent" | "Pending" | "Failed";
  sentAt: string;
};

export type Transaction = {
  id: string;
  ref: string;
  student: string;
  workspace: string;
  level: string;
  category: string;
  totalAmount: number;
  paidAmount: number;
  method: string;
  status: "Paid" | "Partial" | "Outstanding";
  date: string;
};

const photo = (seed: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear`;

export const STUDENTS: Student[] = [
  { id: "s1", name: "Aïsha Nkomo", photo: photo("Aïsha N"), studentId: "GFS-2025-001", workspace: "Primary", level: "Class 5", section: "Primary", className: "Class 5 A", parent: "Marie Nkomo", parentId: "p1", guardian: "Marie Nkomo", parentPhone: "+237 670 11 22 01", parentEmail: "marie@example.com", attendance: 96, status: "Active", registration: "Registered", totalFees: 300000, paidFees: 300000, digitalId: "Issued" },
  { id: "s2", name: "Brian Tabi", photo: photo("Brian T"), studentId: "GFS-2025-002", workspace: "Primary", level: "Class 6", section: "Primary", className: "Class 6 B", parent: "Joseph Tabi", parentId: "p2", guardian: "Joseph Tabi", parentPhone: "+237 670 11 22 02", parentEmail: "joseph@example.com", attendance: 88, status: "Active", registration: "Registered", totalFees: 300000, paidFees: 180000, digitalId: "Issued" },
  { id: "s3", name: "Chiamaka Eze", photo: photo("Chiamaka E"), studentId: "GFS-2025-003", workspace: "Secondary", level: "Form 3", section: "Secondary", className: "Form 3", parent: "Ngozi Eze", parentId: "p3", guardian: "Ngozi Eze", parentPhone: "+234 803 55 22 03", parentEmail: "ngozi@example.com", attendance: 92, status: "Active", registration: "Registered", totalFees: 420000, paidFees: 420000, digitalId: "Issued" },
  { id: "s4", name: "Daniel Mbah", photo: photo("Daniel M"), studentId: "GFS-2025-004", workspace: "Secondary", level: "Form 5", section: "Secondary", className: "Form 5", parent: "Paul Mbah", parentId: "p4", guardian: "Paul Mbah", parentPhone: "+237 690 11 22 04", parentEmail: "paul@example.com", attendance: 74, status: "Active", registration: "Pending", totalFees: 480000, paidFees: 200000, digitalId: "Pending" },
  { id: "s5", name: "Esther Ngono", photo: photo("Esther N"), studentId: "GFS-2025-005", workspace: "Primary", level: "Class 4", section: "Primary", className: "Class 4 A", parent: "Sandra Ngono", parentId: "p5", guardian: "Sandra Ngono", parentPhone: "+237 690 11 22 05", parentEmail: "sandra@example.com", attendance: 99, status: "Active", registration: "Registered", totalFees: 300000, paidFees: 150000, digitalId: "Issued" },
  { id: "s6", name: "Frank Owusu", photo: photo("Frank O"), studentId: "GFS-2025-006", workspace: "University", level: "Level 1", section: "University", className: "Level 1 CS", parent: "Akosua Owusu", parentId: "p6", guardian: "Akosua Owusu", parentPhone: "+233 244 55 22 06", parentEmail: "akosua@example.com", attendance: 81, status: "Active", registration: "Registered", totalFees: 850000, paidFees: 650000, digitalId: "Issued" },
  { id: "s7", name: "Grace Bello", photo: photo("Grace B"), studentId: "GFS-2025-007", workspace: "Secondary", level: "Form 4", section: "Secondary", className: "Form 4", parent: "Yemi Bello", parentPhone: "+234 803 55 22 04", parentEmail: "yemi@example.com", attendance: 90, status: "Active", registration: "Registered", totalFees: 450000, paidFees: 450000, digitalId: "Issued" },
  { id: "s8", name: "Hassan Diallo", photo: photo("Hassan D"), studentId: "GFS-2025-008", workspace: "University", level: "Level 2", section: "University", className: "Level 2 Eco", parent: "Aminata Diallo", parentPhone: "+221 77 55 22 06", parentEmail: "aminata@example.com", attendance: 67, status: "Archived", registration: "Withdrawn", totalFees: 850000, paidFees: 200000, digitalId: "Pending" },
  { id: "s9", name: "Ines Tchoumi", photo: photo("Ines T"), studentId: "GFS-2025-009", workspace: "Nursery", level: "Nursery 2", className: "Nursery 2", parent: "Carole Tchoumi", parentPhone: "+237 670 99 11 01", parentEmail: "carole@example.com", attendance: 95, status: "Active", registration: "Registered", totalFees: 180000, paidFees: 180000, digitalId: "Issued" },
  { id: "s10", name: "Jonas Mvogo", photo: photo("Jonas M"), studentId: "GFS-2025-010", workspace: "Secondary", level: "Form 3", className: "Form 3", parent: "Pierre Mvogo", parentPhone: "+237 690 99 11 02", parentEmail: "pierre@example.com", attendance: 86, status: "Active", registration: "Registered", totalFees: 420000, paidFees: 250000, digitalId: "Issued" },
  { id: "s11", name: "Kemi Adeyemi", photo: photo("Kemi A"), studentId: "GFS-2025-011", workspace: "Primary", level: "Class 1", className: "Class 1", parent: "Ade Adeyemi", parentPhone: "+234 803 99 11 03", parentEmail: "ade@example.com", attendance: 97, status: "Active", registration: "Registered", totalFees: 280000, paidFees: 280000, digitalId: "Issued" },
  { id: "s12", name: "Leo Mensah", photo: photo("Leo M"), studentId: "GFS-2025-012", workspace: "Secondary", level: "Lower Sixth", className: "Lower Sixth", parent: "Kojo Mensah", parentPhone: "+233 244 99 11 04", parentEmail: "kojo@example.com", attendance: 91, status: "Active", registration: "Registered", totalFees: 520000, paidFees: 300000, digitalId: "Issued" },
];

export const PARENTS: Parent[] = [
  { id: "p1", name: "Marie Nkomo", phone: "+237 670 11 22 01", email: "marie@example.com", workspace: "Primary", level: "Class 5", children: ["Aïsha Nkomo"], lastMessage: "Fee reminder — 2 days ago" },
  { id: "p2", name: "Joseph Tabi", phone: "+237 670 11 22 02", email: "joseph@example.com", workspace: "Primary", level: "Class 6", children: ["Brian Tabi"], lastMessage: "Absence alert — yesterday" },
  { id: "p3", name: "Ngozi Eze", phone: "+234 803 55 22 03", email: "ngozi@example.com", workspace: "Secondary", level: "Form 3", children: ["Chiamaka Eze"], lastMessage: "School notice — 5 days ago" },
  { id: "p4", name: "Paul Mbah", phone: "+237 690 11 22 04", email: "paul@example.com", workspace: "Secondary", level: "Form 5", children: ["Daniel Mbah"], lastMessage: "Late arrival — today" },
  { id: "p5", name: "Sandra Ngono", phone: "+237 690 11 22 05", email: "sandra@example.com", workspace: "Primary", level: "Class 4", children: ["Esther Ngono"], lastMessage: "Weekly summary — Friday" },
  { id: "p6", name: "Akosua Owusu", phone: "+233 244 55 22 06", email: "akosua@example.com", workspace: "University", level: "Level 1", children: ["Frank Owusu"], lastMessage: "Welcome — 1 month ago" },
  { id: "p7", name: "Carole Tchoumi", phone: "+237 670 99 11 01", email: "carole@example.com", workspace: "Nursery", level: "Nursery 2", children: ["Ines Tchoumi"], lastMessage: "Photo day — today" },
  { id: "p8", name: "Kojo Mensah", phone: "+233 244 99 11 04", email: "kojo@example.com", workspace: "Secondary", level: "Lower Sixth", children: ["Leo Mensah"], lastMessage: "Term invoice — 3 days ago" },
];

export const TEACHERS: Teacher[] = [
  { id: "t1", name: "Mr. Emeka Obi", subject: "Mathematics", department: "Sciences", position: "Senior Teacher", phone: "+234 803 22 11 01", attendance: 98, payroll: "XAF 320,000", monthlyHours: 80, hoursTaught: 78, attendanceHours: 76 },
  { id: "t2", name: "Mme. Aline Foka", subject: "French", department: "Languages", position: "Teacher", phone: "+237 670 22 11 02", attendance: 95, payroll: "XAF 280,000", monthlyHours: 70, hoursTaught: 70, attendanceHours: 68 },
  { id: "t3", name: "Mr. Samuel Kim", subject: "Physics", department: "Sciences", position: "Lab Teacher", phone: "+237 670 22 11 03", attendance: 92, payroll: "XAF 310,000", monthlyHours: 60, hoursTaught: 58, attendanceHours: 55 },
  { id: "t4", name: "Mrs. Lillian Boateng", subject: "History", department: "Humanities", position: "Teacher", phone: "+233 244 22 11 04", attendance: 97, payroll: "XAF 270,000", monthlyHours: 65, hoursTaught: 64, attendanceHours: 63 },
  { id: "t5", name: "Mr. Ibrahim Sow", subject: "ICT", department: "Sciences", position: "Head of ICT", phone: "+221 77 22 11 05", attendance: 90, payroll: "XAF 350,000", monthlyHours: 72, hoursTaught: 70, attendanceHours: 65 },
];

export const MESSAGES: Message[] = [
  { id: "m1", channel: "SMS", audience: "Secondary › Form 4 › Parents", subject: "Fee reminder — 3rd term", status: "Sent", sentAt: "Today, 09:14" },
  { id: "m2", channel: "Push", audience: "Whole school", subject: "School closed Friday afternoon", status: "Sent", sentAt: "Yesterday, 17:02" },
  { id: "m3", channel: "Email", audience: "Teachers", subject: "Staff meeting Monday", status: "Sent", sentAt: "2 days ago" },
  { id: "m4", channel: "SMS", audience: "Individual › Marie Nkomo", subject: "Aïsha — absence alert", status: "Pending", sentAt: "Today, 08:31" },
  { id: "m5", channel: "WhatsApp", audience: "Primary › All › Parents", subject: "Weekly attendance summary", status: "Failed", sentAt: "Last Friday" },
];

export const TRANSACTIONS: Transaction[] = [
  { id: "tx1", ref: "TRX-90021", student: "Aïsha Nkomo", workspace: "Primary", level: "Class 5", category: "Tuition — Term 2", totalAmount: 150000, paidAmount: 150000, method: "Mobile Money", status: "Paid", date: "Today" },
  { id: "tx2", ref: "TRX-90022", student: "Brian Tabi", workspace: "Primary", level: "Class 6", category: "Tuition — Term 2", totalAmount: 150000, paidAmount: 90000, method: "Cash", status: "Partial", date: "Today" },
  { id: "tx3", ref: "TRX-90023", student: "Chiamaka Eze", workspace: "Secondary", level: "Form 3", category: "Tuition — Term 2", totalAmount: 180000, paidAmount: 0, method: "Bank Transfer", status: "Outstanding", date: "Yesterday" },
  { id: "tx4", ref: "TRX-90024", student: "Daniel Mbah", workspace: "Secondary", level: "Form 5", category: "Registration", totalAmount: 50000, paidAmount: 50000, method: "Mobile Money", status: "Paid", date: "2 days ago" },
  { id: "tx5", ref: "TRX-90025", student: "Frank Owusu", workspace: "University", level: "Level 1", category: "Tuition — Term 2", totalAmount: 220000, paidAmount: 120000, method: "Bank Transfer", status: "Partial", date: "3 days ago" },
  { id: "tx6", ref: "TRX-90026", student: "Grace Bello", workspace: "Secondary", level: "Form 4", category: "Tuition — Term 2", totalAmount: 150000, paidAmount: 150000, method: "Mobile Money", status: "Paid", date: "4 days ago" },
];

export const MESSAGE_TEMPLATES = [
  { id: "tpl1", title: "Fee reminder", body: "Dear parent, this is a friendly reminder that {student}'s tuition is due on {date}." },
  { id: "tpl2", title: "Attendance alert", body: "{student} was marked absent today at {school}. Please contact us if this is unexpected." },
  { id: "tpl3", title: "School notice", body: "Dear families, please note that {school} will be closed on {date} for {reason}." },
  { id: "tpl4", title: "Emergency", body: "URGENT — please follow instructions from {school} regarding {event}. Stay safe." },
];

export const PARENT_THREADS = [
  { id: "th1", parent: "Marie Nkomo", lastMessage: "Thank you, we'll be there.", time: "10 min ago", unread: 0 },
  { id: "th2", parent: "Paul Mbah", lastMessage: "Why was Daniel marked absent?", time: "1 hr ago", unread: 2 },
  { id: "th3", parent: "Ade Adeyemi", lastMessage: "Can we pay in two parts?", time: "Today", unread: 1 },
];

export const TIMETABLE_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
export const TIMETABLE_PERIODS = [
  "08:00 – 09:00",
  "09:00 – 10:00",
  "10:15 – 11:15",
  "11:15 – 12:15",
  "13:00 – 14:00",
  "14:00 – 15:00",
];

export const TIMETABLE_SAMPLE: Record<string, { subject: string; teacher: string } | null> = {
  "Mon-0": { subject: "Maths", teacher: "Mr. Obi" },
  "Mon-1": { subject: "French", teacher: "Mme. Foka" },
  "Mon-2": { subject: "Physics", teacher: "Mr. Kim" },
  "Tue-0": { subject: "ICT", teacher: "Mr. Sow" },
  "Tue-1": { subject: "History", teacher: "Mrs. Boateng" },
  "Tue-3": { subject: "Maths", teacher: "Mr. Obi" },
  "Wed-0": { subject: "French", teacher: "Mme. Foka" },
  "Wed-2": { subject: "Physics", teacher: "Mr. Kim" },
  "Wed-4": { subject: "Sports", teacher: "Coach Ali" },
  "Thu-1": { subject: "Maths", teacher: "Mr. Obi" },
  "Thu-3": { subject: "ICT", teacher: "Mr. Sow" },
  "Fri-0": { subject: "History", teacher: "Mrs. Boateng" },
  "Fri-2": { subject: "French", teacher: "Mme. Foka" },
  "Fri-4": { subject: "Assembly", teacher: "Principal" },
};

export const REPORT_FILES = [
  { id: "r1", title: "Annual Report 2024", type: "Annual", size: "2.4 MB", date: "Dec 2024" },
  { id: "r2", title: "Term 1 Academic Report", type: "Academic", size: "1.1 MB", date: "Nov 2024" },
  { id: "r3", title: "Staff Handbook", type: "Document", size: "820 KB", date: "Sep 2024" },
  { id: "r4", title: "Health & Safety Policy", type: "Document", size: "640 KB", date: "Aug 2024" },
];

export const NOTIFICATIONS = [
  { id: "n1", title: "Late arrival — Daniel Mbah", time: "5 min ago", kind: "attendance" as const },
  { id: "n2", title: "Payment received — Aïsha Nkomo", time: "1 hr ago", kind: "finance" as const },
  { id: "n3", title: "5 messages pending delivery", time: "Today", kind: "messages" as const },
];

export const ATTENDANCE_TODAY = {
  present: 412,
  late: 18,
  absent: 27,
  teachersPresent: 36,
  totalStudents: 457,
  totalTeachers: 38,
};
