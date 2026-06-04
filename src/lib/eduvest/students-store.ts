// Mutable in-memory store for students + manual subclasses.
// Acts as the single source of truth that Attendance, Admissions, Digital ID
// and Finance read from. Subscribers re-render on any update.

import { useEffect, useState } from "react";
import { STUDENTS, type Student } from "./dashboard-mock";
import { compareClass } from "./academic-levels";
import { getItem, setItem } from "./storage";

let students: Student[] = [...STUDENTS];
const subscribers = new Set<() => void>();

function emit() {
  subscribers.forEach((fn) => fn());
}

export function getStudents(): Student[] {
  return students;
}

export function addStudent(s: Student) {
  students = [s, ...students];
  emit();
}

export function addStudents(list: Student[]) {
  students = [...list, ...students];
  emit();
}

export function updateStudent(id: string, patch: Partial<Student>) {
  students = students.map((s) => (s.id === id ? { ...s, ...patch } : s));
  emit();
}

export function removeStudent(id: string) {
  students = students.filter((s) => s.id !== id);
  emit();
}

export function useStudents(): Student[] {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((x) => x + 1);
    subscribers.add(fn);
    return () => {
      subscribers.delete(fn);
    };
  }, []);
  return students;
}

// === Manual subclasses ===
// Key: `${workspace}::${level}` -> string[] of division letters (A, B, C…)

const MANUAL_KEY = "eduvest.manualSubclasses";

type ManualMap = Record<string, string[]>;

function readManual(): ManualMap {
  return getItem<ManualMap>(MANUAL_KEY, {});
}

function writeManual(m: ManualMap) {
  setItem(MANUAL_KEY, m);
  emit();
}

export function getSubclasses(workspace: string, level: string): string[] {
  const fromStudents = new Set(
    students
      .filter((s) => s.workspace === workspace && s.level === level)
      .map((s) => s.division ?? ""),
  );
  const manual = readManual()[`${workspace}::${level}`] ?? [];
  manual.forEach((d) => fromStudents.add(d));
  // Sort: empty first, then A, B, C…
  return Array.from(fromStudents).sort((a, b) => a.localeCompare(b));
}

export function addManualSubclass(workspace: string, level: string, division: string) {
  const key = `${workspace}::${level}`;
  const m = readManual();
  const list = new Set(m[key] ?? []);
  list.add(division);
  m[key] = Array.from(list).sort();
  writeManual(m);
}

export function useSubclasses(workspace: string, level: string): string[] {
  useStudents(); // subscribe to store
  return getSubclasses(workspace, level);
}

// Sorted student list for a workspace + level + division
export function sortStudentsByClass(workspace: string, list: Student[]): Student[] {
  return [...list].sort((a, b) =>
    compareClass(workspace, a.level, a.division, b.level, b.division),
  );
}
