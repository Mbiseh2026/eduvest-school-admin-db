export type AdmissionStatus = "Submitted" | "Under Review" | "Accepted" | "Rejected" | "Waitlist";

export type Admission = {
  id: string;
  ref: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  workspace: string;
  classPreference: string;
  feePaid: boolean;
  submittedAt: string;
  status: AdmissionStatus;
  note?: string;
};

export const ADMISSION_STATUSES: AdmissionStatus[] = [
  "Submitted",
  "Under Review",
  "Accepted",
  "Rejected",
  "Waitlist",
];

export const ADMISSIONS: Admission[] = [
  { id: "a1", ref: "ADM-2026-001", studentName: "Noah Bekele", parentName: "Selam Bekele", parentPhone: "+251 911 22 33 01", parentEmail: "selam@example.com", workspace: "Primary", classPreference: "Class 1", feePaid: true, submittedAt: "Today", status: "Under Review" },
  { id: "a2", ref: "ADM-2026-002", studentName: "Aminah Yusuf", parentName: "Yusuf Bello", parentPhone: "+234 803 22 33 02", parentEmail: "yusuf@example.com", workspace: "Secondary", classPreference: "Form 1", feePaid: false, submittedAt: "Yesterday", status: "Submitted" },
  { id: "a3", ref: "ADM-2026-003", studentName: "Théo Kamga", parentName: "Sylvie Kamga", parentPhone: "+237 670 22 33 03", parentEmail: "sylvie@example.com", workspace: "Nursery", classPreference: "Nursery 1", feePaid: true, submittedAt: "2 days ago", status: "Accepted" },
  { id: "a4", ref: "ADM-2026-004", studentName: "Olivia Owusu", parentName: "Kwame Owusu", parentPhone: "+233 244 22 33 04", parentEmail: "kwame@example.com", workspace: "Secondary", classPreference: "Form 4", feePaid: true, submittedAt: "3 days ago", status: "Waitlist" },
];
