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

  // Rich admission details (optional)
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  nationality?: string;
  address?: string;
  religion?: string;
  previousSchool?: string;
  reasonForChange?: string;
  whatsappSameAsPhone?: boolean;
  whatsappPhone?: string;
  bloodGroup?: string;
  allergies?: string;
  conditions?: string;
  emergencyContact?: string;
  motherName?: string;
  motherPhone?: string;
  fatherName?: string;
  fatherPhone?: string;
  parentsMaritalStatus?: "Married" | "Separated" | "Divorced" | "Widowed" | "Single";
  guardianRelation?: string;
  totalFees?: number;
  paidFees?: number;
};

export const ADMISSION_STATUSES: AdmissionStatus[] = [
  "Submitted",
  "Under Review",
  "Accepted",
  "Rejected",
  "Waitlist",
];

export const ADMISSIONS: Admission[] = [
  {
    id: "a1", ref: "ADM-2026-001", studentName: "Noah Bekele", parentName: "Selam Bekele",
    parentPhone: "+251 911 22 33 01", parentEmail: "selam@example.com",
    workspace: "Primary", classPreference: "Class 1", feePaid: true,
    submittedAt: "Today", status: "Under Review",
    dob: "2019-05-12", gender: "Male", nationality: "Ethiopian", address: "Addis Ababa, Bole",
    bloodGroup: "O+", allergies: "None", conditions: "None", emergencyContact: "+251 911 22 33 99",
    motherName: "Selam Bekele", motherPhone: "+251 911 22 33 01",
    fatherName: "Daniel Bekele", fatherPhone: "+251 911 22 33 02",
    parentsMaritalStatus: "Married", previousSchool: "Little Stars Nursery",
    totalFees: 300000, paidFees: 50000,
  },
  {
    id: "a2", ref: "ADM-2026-002", studentName: "Aminah Yusuf", parentName: "Yusuf Bello",
    parentPhone: "+234 803 22 33 02", parentEmail: "yusuf@example.com",
    workspace: "Secondary", classPreference: "Form 1", feePaid: false,
    submittedAt: "Yesterday", status: "Submitted",
    dob: "2013-09-21", gender: "Female", nationality: "Nigerian", address: "Lagos, Lekki",
    bloodGroup: "A+", allergies: "Peanuts", conditions: "Asthma",
    emergencyContact: "+234 803 22 33 99",
    motherName: "Fatima Bello", motherPhone: "+234 803 22 33 03",
    fatherName: "Yusuf Bello", fatherPhone: "+234 803 22 33 02",
    parentsMaritalStatus: "Married", previousSchool: "Bright Minds Primary",
    totalFees: 420000, paidFees: 0,
  },
  {
    id: "a3", ref: "ADM-2026-003", studentName: "Théo Kamga", parentName: "Sylvie Kamga",
    parentPhone: "+237 670 22 33 03", parentEmail: "sylvie@example.com",
    workspace: "Nursery", classPreference: "Nursery 1", feePaid: true,
    submittedAt: "2 days ago", status: "Accepted",
    dob: "2022-02-04", gender: "Male", nationality: "Cameroonian", address: "Douala, Bonanjo",
    bloodGroup: "B+", allergies: "None", conditions: "None",
    emergencyContact: "+237 670 22 33 99",
    motherName: "Sylvie Kamga", motherPhone: "+237 670 22 33 03",
    fatherName: "Pierre Kamga", fatherPhone: "+237 670 22 33 04",
    parentsMaritalStatus: "Married",
    totalFees: 180000, paidFees: 90000,
  },
  {
    id: "a4", ref: "ADM-2026-004", studentName: "Olivia Owusu", parentName: "Kwame Owusu",
    parentPhone: "+233 244 22 33 04", parentEmail: "kwame@example.com",
    workspace: "Secondary", classPreference: "Form 4", feePaid: true,
    submittedAt: "3 days ago", status: "Waitlist",
    dob: "2010-11-30", gender: "Female", nationality: "Ghanaian", address: "Accra, East Legon",
    bloodGroup: "AB+", allergies: "Dust", conditions: "None",
    emergencyContact: "+233 244 22 33 99",
    motherName: "Ama Owusu", motherPhone: "+233 244 22 33 05",
    fatherName: "Kwame Owusu", fatherPhone: "+233 244 22 33 04",
    parentsMaritalStatus: "Married", previousSchool: "Accra Academy",
    totalFees: 450000, paidFees: 150000,
  },
];

// Convert an accepted admission into a Student record.
import type { Student } from "./dashboard-mock";

export function admissionToStudent(a: Admission): Student {
  const photoSeed = encodeURIComponent(a.studentName);
  return {
    id: `s-${a.id}`,
    name: a.studentName,
    photo: `https://api.dicebear.com/9.x/initials/svg?seed=${photoSeed}&backgroundType=gradientLinear`,
    studentId: a.ref.replace("ADM", "GFS"),
    workspace: a.workspace,
    level: a.classPreference,
    division: undefined,
    className: a.classPreference,
    parent: a.parentName,
    guardian: a.parentName,
    parentPhone: a.parentPhone,
    parentEmail: a.parentEmail,
    attendance: 100,
    status: "Active",
    registration: a.feePaid ? "Registered" : "Pending",
    totalFees: a.totalFees ?? 0,
    paidFees: a.paidFees ?? 0,
    digitalId: "Pending",
    dob: a.dob,
    gender: a.gender,
    nationality: a.nationality,
    address: a.address,
    religion: a.religion,
    previousSchool: a.previousSchool,
    bloodGroup: a.bloodGroup,
    allergies: a.allergies,
    conditions: a.conditions,
    emergencyContact: a.emergencyContact,
    motherName: a.motherName,
    motherPhone: a.motherPhone,
    fatherName: a.fatherName,
    fatherPhone: a.fatherPhone,
    parentsMaritalStatus: a.parentsMaritalStatus,
    guardianRelation: a.guardianRelation,
    remarks: [],
  };
}
