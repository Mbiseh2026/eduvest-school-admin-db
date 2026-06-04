// Single source of truth for academic classes per workspace.
// Each workspace exposes English + French class lists separately so the UI
// can toggle between sections while data isolation per workspace is kept.

import type { Language } from "@/hooks/use-language";

export type WorkspaceName =
  | "Pre-Nursery"
  | "Nursery"
  | "Primary"
  | "Secondary"
  | "Higher Education"
  | "Higher Institute"
  | "University"
  | string;

export type AcademicSection = "english" | "french";

// English section per workspace
export const ENGLISH_LEVELS: Record<string, string[]> = {
  "Pre-Nursery": ["Crèche", "Pre-Nursery"],
  Nursery: ["Nursery 1", "Nursery 2"],
  Primary: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6"],
  Secondary: ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5"],
  "Higher Education": ["Lower Sixth", "Upper Sixth"],
  "Higher Institute": ["Level 1", "Level 2", "Level 3", "HND 1", "HND 2"],
  University: ["Level 1", "Level 2", "Level 3", "Level 4", "Masters 1", "Masters 2", "PhD"],
};

// French section per workspace
export const FRENCH_LEVELS: Record<string, string[]> = {
  "Pre-Nursery": ["Pré-maternelle"],
  Nursery: ["Petite Section", "Moyenne Section", "Grande Section"],
  Primary: ["SIL", "CP", "CE1", "CE2", "CM1", "CM2"],
  Secondary: ["6ème", "5ème", "4ème", "3ème", "2nde"],
  "Higher Education": ["Première", "Terminale"],
  "Higher Institute": ["BTS 1", "BTS 2"],
  University: ["Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2", "Doctorat"],
};

// Combined list (kept for components that don't care about section).
export const LEVELS_BY_WORKSPACE: Record<string, string[]> = Object.fromEntries(
  Array.from(
    new Set([
      ...Object.keys(ENGLISH_LEVELS),
      ...Object.keys(FRENCH_LEVELS),
    ]),
  ).map((ws) => [ws, [...(ENGLISH_LEVELS[ws] ?? []), ...(FRENCH_LEVELS[ws] ?? [])]]),
);

export function getLevels(workspace: string, _lang: Language = "en"): string[] {
  return LEVELS_BY_WORKSPACE[workspace] ?? [];
}

export function getSectionLevels(workspace: string, section: AcademicSection): string[] {
  return section === "english"
    ? ENGLISH_LEVELS[workspace] ?? []
    : FRENCH_LEVELS[workspace] ?? [];
}

export function detectSection(workspace: string, level: string): AcademicSection {
  if ((FRENCH_LEVELS[workspace] ?? []).includes(level)) return "french";
  return "english";
}

export function getAllWorkspaces(): string[] {
  return Object.keys(LEVELS_BY_WORKSPACE);
}

// Class divisions / streams (A, B, C…). Empty string = no division.
export const DIVISIONS: string[] = ["", "A", "B", "C", "D", "E", "F"];

export function getDivisions(): string[] {
  return DIVISIONS;
}

export function classLabel(level: string, division?: string): string {
  return division ? `${level} ${division}`.trim() : level;
}

export function normalizeLevel(_workspace: string, level: string): string {
  return level;
}

// Sort helper: by level index in workspace then alphabetical division.
export function compareClass(
  workspace: string,
  aLevel: string,
  aDiv: string | undefined,
  bLevel: string,
  bDiv: string | undefined,
): number {
  const order = LEVELS_BY_WORKSPACE[workspace] ?? [];
  const ai = order.indexOf(aLevel);
  const bi = order.indexOf(bLevel);
  if (ai !== bi) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  return (aDiv ?? "").localeCompare(bDiv ?? "");
}
