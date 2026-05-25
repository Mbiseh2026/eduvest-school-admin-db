import { useCallback, useEffect, useState } from "react";
import { getItem, setItem } from "@/lib/eduvest/storage";
import type { SchoolType } from "@/lib/eduvest/mock";

export type OnboardingState = {
  step: number;
  profile: {
    schoolName: string;
    address: string;
    country: string;
    phone: string;
    email: string;
    motto: string;
    website: string;
    logoDataUrl: string;
    principalName: string;
    schoolTypes: SchoolType[];
  };
  academic: {
    sections: string[];
    campuses: string[];
    streams: string[];
    levels: string[];
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    socials: { facebook: string; twitter: string; instagram: string; linkedin: string };
  };
  students: { studentCount: number; parentCount: number; importFileName: string };
  teachers: { teacherCount: number; hrCount: number; importFileName: string };
  timetable: { academicYear: string; termSystem: "Trimester" | "Semester"; reportTemplate: string };
  finance: {
    currency: string;
    feeCategories: string[];
    paymentMethods: { mobileMoney: boolean; bankTransfer: boolean; cash: boolean; card: boolean };
  };
};

const KEY = "eduvest.onboarding";

const initial: OnboardingState = {
  step: 1,
  profile: {
    schoolName: "",
    address: "",
    country: "Cameroon",
    phone: "",
    email: "",
    motto: "",
    website: "",
    logoDataUrl: "",
    principalName: "",
    schoolTypes: [],
  },
  academic: { sections: [], campuses: [], streams: [], levels: [] },
  branding: {
    primaryColor: "#16A34A",
    secondaryColor: "#1E3A8A",
    socials: { facebook: "", twitter: "", instagram: "", linkedin: "" },
  },
  students: { studentCount: 0, parentCount: 0, importFileName: "" },
  teachers: { teacherCount: 0, hrCount: 0, importFileName: "" },
  timetable: { academicYear: "2025/2026", termSystem: "Trimester", reportTemplate: "Standard" },
  finance: {
    currency: "XAF",
    feeCategories: ["Tuition", "Registration", "Books"],
    paymentMethods: { mobileMoney: true, bankTransfer: true, cash: true, card: false },
  },
};

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(() => getItem<OnboardingState>(KEY, initial));

  useEffect(() => {
    setItem(KEY, state);
  }, [state]);

  const update = useCallback(<K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, step: Math.max(1, Math.min(9, step)) }));
  }, []);

  const reset = useCallback(() => setState(initial), []);

  return { state, update, setStep, reset };
}
