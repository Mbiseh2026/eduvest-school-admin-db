// Lightweight mock data for the EduVest dashboard MVP.
// Placeholder until backend integration.

export type StudentRemark = {
  id: string;
  date: string;
  teacher: string;
  text: string;
};

export type Student = {
  id: string;
  name: string;
  photo: string;
  studentId: string;
  workspace: string; // e.g. "Primary", "Secondary"
  level: string; // Canonical class label, e.g. "Form 3" or "6ème"
  division?: string; // Optional stream, e.g. "A", "B"
  section?: "Primary" | "Secondary" | "University"; // legacy
  className: string; // human friendly e.g. "Form 3 A"
  parent: string;
  parentId?: string;
  guardian?: string;
  parentPhone: string;
  parentEmail: string;
  whatsappSameAsPhone?: boolean;
  whatsappPhone?: string;
  reasonForChange?: string;
  attendance: number;
  status: "Active" | "Archived";
  registration: "Registered" | "Pending" | "Withdrawn";
  totalFees: number;
  paidFees: number;
  digitalId: "Issued" | "Pending";

  // Extended (from admission). All optional for backward compatibility.
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  nationality?: string;
  address?: string;
  religion?: string;
  previousSchool?: string;
  // Health
  bloodGroup?: string;
  allergies?: string;
  conditions?: string;
  emergencyContact?: string;
  // Family
  motherName?: string;
  motherPhone?: string;
  fatherName?: string;
  fatherPhone?: string;
  parentsMaritalStatus?: "Married" | "Separated" | "Divorced" | "Widowed" | "Single";
  guardianRelation?: string;
  // Documents (mock URLs)
  documents?: { label: string; url: string }[];
  // Teacher remarks (per day)
  remarks?: StudentRemark[];
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

export type AssignedClass = { workspace: string; level: string; division?: string };

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
  assignedClasses?: AssignedClass[];
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
  { id: "s1", name: "Aïsha Nkomo", photo: photo("Aïsha N"), studentId: "GFS-2025-001", workspace: "Primary", level: "Class 5", division: "A", section: "Primary", className: "Class 5 A", parent: "Marie Nkomo", parentId: "p1", guardian: "Marie Nkomo", parentPhone: "+237 670 11 22 01", parentEmail: "marie@example.com", attendance: 96, status: "Active", registration: "Registered", totalFees: 300000, paidFees: 300000, digitalId: "Issued" },
  { id: "s2", name: "Brian Tabi", photo: photo("Brian T"), studentId: "GFS-2025-002", workspace: "Primary", level: "Class 6", division: "B", section: "Primary", className: "Class 6 B", parent: "Joseph Tabi", parentId: "p2", guardian: "Joseph Tabi", parentPhone: "+237 670 11 22 02", parentEmail: "joseph@example.com", attendance: 88, status: "Active", registration: "Registered", totalFees: 300000, paidFees: 180000, digitalId: "Issued" },
  { id: "s3", name: "Chiamaka Eze", photo: photo("Chiamaka E"), studentId: "GFS-2025-003", workspace: "Secondary", level: "Form 3", division: "A", section: "Secondary", className: "Form 3 A", parent: "Ngozi Eze", parentId: "p3", guardian: "Ngozi Eze", parentPhone: "+234 803 55 22 03", parentEmail: "ngozi@example.com", attendance: 92, status: "Active", registration: "Registered", totalFees: 420000, paidFees: 420000, digitalId: "Issued" },
  { id: "s4", name: "Daniel Mbah", photo: photo("Daniel M"), studentId: "GFS-2025-004", workspace: "Secondary", level: "Form 5", division: "B", section: "Secondary", className: "Form 5 B", parent: "Paul Mbah", parentId: "p4", guardian: "Paul Mbah", parentPhone: "+237 690 11 22 04", parentEmail: "paul@example.com", attendance: 74, status: "Active", registration: "Pending", totalFees: 480000, paidFees: 200000, digitalId: "Pending" },
  { id: "s5", name: "Esther Ngono", photo: photo("Esther N"), studentId: "GFS-2025-005", workspace: "Primary", level: "Class 4", division: "A", section: "Primary", className: "Class 4 A", parent: "Sandra Ngono", parentId: "p5", guardian: "Sandra Ngono", parentPhone: "+237 690 11 22 05", parentEmail: "sandra@example.com", attendance: 99, status: "Active", registration: "Registered", totalFees: 300000, paidFees: 150000, digitalId: "Issued" },
  { id: "s6", name: "Frank Owusu", photo: photo("Frank O"), studentId: "GFS-2025-006", workspace: "University", level: "Level 1", section: "University", className: "Level 1 CS", parent: "Akosua Owusu", parentId: "p6", guardian: "Akosua Owusu", parentPhone: "+233 244 55 22 06", parentEmail: "akosua@example.com", attendance: 81, status: "Active", registration: "Registered", totalFees: 850000, paidFees: 650000, digitalId: "Issued" },
  { id: "s7", name: "Grace Bello", photo: photo("Grace B"), studentId: "GFS-2025-007", workspace: "Secondary", level: "Form 4", division: "A", section: "Secondary", className: "Form 4 A", parent: "Yemi Bello", parentPhone: "+234 803 55 22 04", parentEmail: "yemi@example.com", attendance: 90, status: "Active", registration: "Registered", totalFees: 450000, paidFees: 450000, digitalId: "Issued" },
  { id: "s8", name: "Hassan Diallo", photo: photo("Hassan D"), studentId: "GFS-2025-008", workspace: "University", level: "Level 2", section: "University", className: "Level 2 Eco", parent: "Aminata Diallo", parentPhone: "+221 77 55 22 06", parentEmail: "aminata@example.com", attendance: 67, status: "Archived", registration: "Withdrawn", totalFees: 850000, paidFees: 200000, digitalId: "Pending" },
  { id: "s9", name: "Ines Tchoumi", photo: photo("Ines T"), studentId: "GFS-2025-009", workspace: "Nursery", level: "Nursery 2", className: "Nursery 2", parent: "Carole Tchoumi", parentPhone: "+237 670 99 11 01", parentEmail: "carole@example.com", attendance: 95, status: "Active", registration: "Registered", totalFees: 180000, paidFees: 180000, digitalId: "Issued" },
  { id: "s10", name: "Jonas Mvogo", photo: photo("Jonas M"), studentId: "GFS-2025-010", workspace: "Secondary", level: "6ème", division: "A", className: "6ème A", parent: "Pierre Mvogo", parentPhone: "+237 690 99 11 02", parentEmail: "pierre@example.com", attendance: 86, status: "Active", registration: "Registered", totalFees: 420000, paidFees: 250000, digitalId: "Issued" },
  { id: "s11", name: "Kemi Adeyemi", photo: photo("Kemi A"), studentId: "GFS-2025-011", workspace: "Primary", level: "Class 1", className: "Class 1", parent: "Ade Adeyemi", parentPhone: "+234 803 99 11 03", parentEmail: "ade@example.com", attendance: 97, status: "Active", registration: "Registered", totalFees: 280000, paidFees: 280000, digitalId: "Issued" },
  { id: "s12", name: "Leo Mensah", photo: photo("Leo M"), studentId: "GFS-2025-012", workspace: "Higher Education", level: "Lower Sixth", division: "A", className: "Lower Sixth A", parent: "Kojo Mensah", parentPhone: "+233 244 99 11 04", parentEmail: "kojo@example.com", attendance: 91, status: "Active", registration: "Registered", totalFees: 520000, paidFees: 300000, digitalId: "Issued" },
  { id: "s13", name: "Mariam Touré", photo: photo("Mariam T"), studentId: "GFS-2025-013", workspace: "Primary", level: "CE1", division: "A", className: "CE1 A", parent: "Aïcha Touré", parentPhone: "+237 690 33 44 13", parentEmail: "aicha@example.com", attendance: 94, status: "Active", registration: "Registered", totalFees: 280000, paidFees: 280000, digitalId: "Issued" },
  { id: "s14", name: "Olivier Kana", photo: photo("Olivier K"), studentId: "GFS-2025-014", workspace: "Secondary", level: "3ème", division: "B", className: "3ème B", parent: "Brigitte Kana", parentPhone: "+237 690 33 44 14", parentEmail: "brigitte@example.com", attendance: 89, status: "Active", registration: "Registered", totalFees: 420000, paidFees: 320000, digitalId: "Issued" },
  { id: "s15", name: "Sophie Atangana", photo: photo("Sophie A"), studentId: "GFS-2025-015", workspace: "Higher Education", level: "Terminale", division: "A", className: "Terminale A", parent: "Jeanne Atangana", parentPhone: "+237 690 33 44 15", parentEmail: "jeanne@example.com", attendance: 93, status: "Active", registration: "Registered", totalFees: 560000, paidFees: 400000, digitalId: "Issued" },
  { id: "s16", name: "Thierry Mbarga", photo: photo("Thierry M"), studentId: "GFS-2025-016", workspace: "Pre-Nursery", level: "Crèche", className: "Crèche", parent: "Marthe Mbarga", parentPhone: "+237 690 33 44 16", parentEmail: "marthe@example.com", attendance: 97, status: "Active", registration: "Registered", totalFees: 150000, paidFees: 150000, digitalId: "Issued" },
];

export const PARENTS: Parent[] = [
  { id: "p1", name: "Marie Nkomo", phone: "+237 670 11 22 01", email: "marie@example.com", workspace: "Primary", level: "Class 5", children: ["Aïsha Nkomo"], lastMessage: "Fee reminder — 2 days ago" },
  { id: "p2", name: "Joseph Tabi", phone: "+237 670 11 22 02", email: "joseph@example.com", workspace: "Primary", level: "Class 6", children: ["Brian Tabi"], lastMessage: "Absence alert — yesterday" },
  { id: "p3", name: "Ngozi Eze", phone: "+234 803 55 22 03", email: "ngozi@example.com", workspace: "Secondary", level: "Form 3", children: ["Chiamaka Eze"], lastMessage: "School notice — 5 days ago" },
  { id: "p4", name: "Paul Mbah", phone: "+237 690 11 22 04", email: "paul@example.com", workspace: "Secondary", level: "Form 5", children: ["Daniel Mbah"], lastMessage: "Late arrival — today" },
  { id: "p5", name: "Sandra Ngono", phone: "+237 690 11 22 05", email: "sandra@example.com", workspace: "Primary", level: "Class 4", children: ["Esther Ngono"], lastMessage: "Weekly summary — Friday" },
  { id: "p6", name: "Akosua Owusu", phone: "+233 244 55 22 06", email: "akosua@example.com", workspace: "University", level: "Level 1", children: ["Frank Owusu"], lastMessage: "Welcome — 1 month ago" },
  { id: "p7", name: "Carole Tchoumi", phone: "+237 670 99 11 01", email: "carole@example.com", workspace: "Nursery", level: "Nursery 2", children: ["Ines Tchoumi"], lastMessage: "Photo day — today" },
  { id: "p8", name: "Kojo Mensah", phone: "+233 244 99 11 04", email: "kojo@example.com", workspace: "Higher Education", level: "Lower Sixth", children: ["Leo Mensah"], lastMessage: "Term invoice — 3 days ago" },
  { id: "p9", name: "Brigitte Kana", phone: "+237 690 33 44 14", email: "brigitte@example.com", workspace: "Secondary", level: "3ème", children: ["Olivier Kana"], lastMessage: "Réunion parents — hier" },
  { id: "p10", name: "Aïcha Touré", phone: "+237 690 33 44 13", email: "aicha@example.com", workspace: "Primary", level: "CE1", children: ["Mariam Touré"], lastMessage: "Bulletin envoyé — lundi" },
  { id: "p11", name: "Jeanne Atangana", phone: "+237 690 33 44 15", email: "jeanne@example.com", workspace: "Higher Education", level: "Terminale", children: ["Sophie Atangana"], lastMessage: "Examen blanc — vendredi" },
  { id: "p12", name: "Marthe Mbarga", phone: "+237 690 33 44 16", email: "marthe@example.com", workspace: "Pre-Nursery", level: "Crèche", children: ["Thierry Mbarga"], lastMessage: "Photo day — today" },
];

export const TEACHERS: Teacher[] = [
  { id: "t1", name: "Mr. Emeka Obi", subject: "Mathematics", department: "Sciences", position: "Senior Teacher", phone: "+234 803 22 11 01", workspace: "Secondary", attendance: 98, payroll: "XAF 320,000", monthlyHours: 80, hoursTaught: 78, attendanceHours: 76, assignedClasses: [{ workspace: "Secondary", level: "Form 3", division: "A" }, { workspace: "Secondary", level: "Form 4", division: "A" }] },
  { id: "t2", name: "Mme. Aline Foka", subject: "French", department: "Languages", position: "Teacher", phone: "+237 670 22 11 02", workspace: "Primary", attendance: 95, payroll: "XAF 280,000", monthlyHours: 70, hoursTaught: 70, attendanceHours: 68, assignedClasses: [{ workspace: "Primary", level: "Class 4", division: "A" }, { workspace: "Primary", level: "CE1", division: "A" }] },
  { id: "t3", name: "Mr. Samuel Kim", subject: "Physics", department: "Sciences", position: "Lab Teacher", phone: "+237 670 22 11 03", workspace: "Secondary", attendance: 92, payroll: "XAF 310,000", monthlyHours: 60, hoursTaught: 58, attendanceHours: 55, assignedClasses: [{ workspace: "Secondary", level: "Form 5", division: "B" }, { workspace: "Secondary", level: "3ème", division: "B" }] },
  { id: "t4", name: "Mrs. Lillian Boateng", subject: "History", department: "Humanities", position: "Teacher", phone: "+233 244 22 11 04", workspace: "Primary", attendance: 97, payroll: "XAF 270,000", monthlyHours: 65, hoursTaught: 64, attendanceHours: 63, assignedClasses: [{ workspace: "Primary", level: "Class 5", division: "A" }, { workspace: "Primary", level: "Class 6", division: "B" }] },
  { id: "t5", name: "Mr. Ibrahim Sow", subject: "ICT", department: "Sciences", position: "Head of ICT", phone: "+221 77 22 11 05", workspace: "University", attendance: 90, payroll: "XAF 350,000", monthlyHours: 72, hoursTaught: 70, attendanceHours: 65, assignedClasses: [{ workspace: "University", level: "Level 1" }, { workspace: "University", level: "Level 2" }] },
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

// === Attendance App sync (read-only on dashboard) ===

export type RollCallStatus = "Completed" | "Pending";

export type RollCall = {
  id: string;
  workspace: string;
  level: string;
  division?: string;
  subject: string;
  teacher: string;
  teacherId: string;
  startsAt: string;
  endsAt: string;
  status: RollCallStatus;
  submittedAt?: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
};

export const ROLL_CALL_TODAY: RollCall[] = [
  { id: "rc1", workspace: "Secondary", level: "Form 3", division: "A", subject: "Mathematics", teacher: "Mr. Emeka Obi", teacherId: "t1", startsAt: "08:00", endsAt: "08:50", status: "Completed", submittedAt: "08:05", present: 24, absent: 2, late: 1, excused: 0 },
  { id: "rc2", workspace: "Secondary", level: "Form 4", division: "A", subject: "Mathematics", teacher: "Mr. Emeka Obi", teacherId: "t1", startsAt: "09:00", endsAt: "09:50", status: "Pending", present: 0, absent: 0, late: 0, excused: 0 },
  { id: "rc3", workspace: "Secondary", level: "Form 5", division: "B", subject: "Physics", teacher: "Mr. Samuel Kim", teacherId: "t3", startsAt: "10:00", endsAt: "10:50", status: "Completed", submittedAt: "10:08", present: 21, absent: 3, late: 0, excused: 1 },
  { id: "rc4", workspace: "Secondary", level: "3ème", division: "B", subject: "Physics", teacher: "Mr. Samuel Kim", teacherId: "t3", startsAt: "11:00", endsAt: "11:50", status: "Pending", present: 0, absent: 0, late: 0, excused: 0 },
  { id: "rc5", workspace: "Primary", level: "Class 5", division: "A", subject: "History", teacher: "Mrs. Lillian Boateng", teacherId: "t4", startsAt: "08:00", endsAt: "08:50", status: "Completed", submittedAt: "08:03", present: 27, absent: 1, late: 2, excused: 0 },
  { id: "rc6", workspace: "Primary", level: "Class 4", division: "A", subject: "Français", teacher: "Mme. Aline Foka", teacherId: "t2", startsAt: "09:00", endsAt: "09:50", status: "Completed", submittedAt: "09:06", present: 25, absent: 2, late: 0, excused: 1 },
  { id: "rc7", workspace: "Primary", level: "CE1", division: "A", subject: "Français", teacher: "Mme. Aline Foka", teacherId: "t2", startsAt: "10:00", endsAt: "10:50", status: "Pending", present: 0, absent: 0, late: 0, excused: 0 },
  { id: "rc8", workspace: "University", level: "Level 1", subject: "ICT Fundamentals", teacher: "Mr. Ibrahim Sow", teacherId: "t5", startsAt: "10:00", endsAt: "11:30", status: "Completed", submittedAt: "10:12", present: 48, absent: 6, late: 2, excused: 0 },
];

export type StudentAttendance = {
  rollCallId: string;
  studentId: string;
  studentName: string;
  status: "Present" | "Absent" | "Late" | "Excused";
  time?: string;
};

export const STUDENT_ATTENDANCE: StudentAttendance[] = [
  { rollCallId: "rc1", studentId: "s3", studentName: "Chiamaka Eze", status: "Present", time: "08:01" },
  { rollCallId: "rc1", studentId: "s7", studentName: "Grace Bello", status: "Late", time: "08:14" },
  { rollCallId: "rc3", studentId: "s4", studentName: "Daniel Mbah", status: "Absent" },
  { rollCallId: "rc5", studentId: "s1", studentName: "Aïsha Nkomo", status: "Present", time: "07:58" },
  { rollCallId: "rc5", studentId: "s2", studentName: "Brian Tabi", status: "Late", time: "08:11" },
  { rollCallId: "rc6", studentId: "s5", studentName: "Esther Ngono", status: "Present", time: "08:55" },
  { rollCallId: "rc8", studentId: "s6", studentName: "Frank Owusu", status: "Present", time: "09:50" },
];

export type GateEvent = {
  id: string;
  studentId: string;
  studentName: string;
  workspace: string;
  level: string;
  division?: string;
  gate: string;
  direction: "IN" | "OUT";
  time: string;
};

export const GATE_EVENTS: GateEvent[] = [
  { id: "g1", studentId: "s1", studentName: "Aïsha Nkomo", workspace: "Primary", level: "Class 5", division: "A", gate: "Gate 1", direction: "IN", time: "07:42" },
  { id: "g2", studentId: "s2", studentName: "Brian Tabi", workspace: "Primary", level: "Class 6", division: "B", gate: "Gate 1", direction: "IN", time: "08:11" },
  { id: "g3", studentId: "s3", studentName: "Chiamaka Eze", workspace: "Secondary", level: "Form 3", division: "A", gate: "Gate 2", direction: "IN", time: "07:55" },
  { id: "g4", studentId: "s7", studentName: "Grace Bello", workspace: "Secondary", level: "Form 4", division: "A", gate: "Gate 2", direction: "IN", time: "08:15" },
  { id: "g5", studentId: "s5", studentName: "Esther Ngono", workspace: "Primary", level: "Class 4", division: "A", gate: "Gate 1", direction: "IN", time: "07:50" },
  { id: "g6", studentId: "s6", studentName: "Frank Owusu", workspace: "University", level: "Level 1", gate: "Main", direction: "IN", time: "09:45" },
];

export type ParentAlert = {
  id: string;
  studentName: string;
  parentName: string;
  workspace: string;
  level: string;
  division?: string;
  reason: "Late" | "Absent" | "No gate entry";
  channels: Array<"Email" | "WhatsApp" | "Push" | "Direct">;
  status: "Pending" | "Sent" | "Snoozed";
};

export const PARENT_ALERTS_TODAY: ParentAlert[] = [
  { id: "al1", studentName: "Daniel Mbah", parentName: "Paul Mbah", workspace: "Secondary", level: "Form 5", division: "B", reason: "Absent", channels: ["Email", "Push"], status: "Pending" },
  { id: "al2", studentName: "Grace Bello", parentName: "Yemi Bello", workspace: "Secondary", level: "Form 4", division: "A", reason: "Late", channels: ["Email", "WhatsApp", "Push"], status: "Pending" },
  { id: "al3", studentName: "Brian Tabi", parentName: "Joseph Tabi", workspace: "Primary", level: "Class 6", division: "B", reason: "Late", channels: ["Push", "Direct"], status: "Sent" },
  { id: "al4", studentName: "Hassan Diallo", parentName: "Aminata Diallo", workspace: "University", level: "Level 2", reason: "No gate entry", channels: ["Email", "WhatsApp"], status: "Pending" },
];

export const WEEKLY_ATTENDANCE = [
  { day: "Mon", present: 422, absent: 35, rate: 92 },
  { day: "Tue", present: 431, absent: 26, rate: 94 },
  { day: "Wed", present: 415, absent: 42, rate: 91 },
  { day: "Thu", present: 408, absent: 49, rate: 89 },
  { day: "Fri", present: 412, absent: 45, rate: 90 },
  { day: "Sat", present: 205, absent: 12, rate: 94 },
];
