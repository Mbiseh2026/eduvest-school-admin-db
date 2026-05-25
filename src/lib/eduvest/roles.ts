// Role-based access — mock layer. Backend will own this in a later phase.

export type Role =
  | "owner"
  | "admin"
  | "finance"
  | "hr"
  | "teacher"
  | "parent"
  | "student";

export type Permission =
  | "dashboard.view"
  | "attendance.view"
  | "messages.view"
  | "messages.send"
  | "finance.view"
  | "finance.write"
  | "payroll.view"
  | "payroll.write"
  | "students.view"
  | "parents.view"
  | "teachers.view"
  | "teachers.write"
  | "timetable.view"
  | "reports.view"
  | "digital-id.view"
  | "ai.dashboard"
  | "ai.general"
  | "settings.view"
  | "settings.users";

export const ROLE_LABELS: Record<Role, string> = {
  owner: "School Owner",
  admin: "School Admin",
  finance: "Finance Officer",
  hr: "HR Officer",
  teacher: "Teacher",
  parent: "Parent",
  student: "Student",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: "Full access across the school workspace.",
  admin: "Operational access — everything except finance ownership.",
  finance: "Income, expenditure and transactions.",
  hr: "Teacher management and payroll.",
  teacher: "Timetable, attendance, messages and AI assistance.",
  parent: "General App only — child information and AI support.",
  student: "General App only — academic guidance and AI support.",
};

const ALL: Permission[] = [
  "dashboard.view",
  "attendance.view",
  "messages.view",
  "messages.send",
  "finance.view",
  "finance.write",
  "payroll.view",
  "payroll.write",
  "students.view",
  "parents.view",
  "teachers.view",
  "teachers.write",
  "timetable.view",
  "reports.view",
  "digital-id.view",
  "ai.dashboard",
  "ai.general",
  "settings.view",
  "settings.users",
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: ALL,
  admin: ALL.filter((p) => p !== "settings.users" ? true : true).filter(
    (p) => !["finance.write", "payroll.write"].includes(p),
  ).concat(["finance.write" as Permission]),
  finance: [
    "dashboard.view",
    "finance.view",
    "finance.write",
    "reports.view",
    "ai.dashboard",
    "settings.view",
  ],
  hr: [
    "dashboard.view",
    "teachers.view",
    "teachers.write",
    "payroll.view",
    "payroll.write",
    "messages.view",
    "messages.send",
    "settings.view",
  ],
  teacher: [
    "dashboard.view",
    "attendance.view",
    "messages.view",
    "messages.send",
    "timetable.view",
    "students.view",
    "ai.general",
  ],
  parent: ["attendance.view", "messages.view", "ai.general"],
  student: ["timetable.view", "ai.general"],
};

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
