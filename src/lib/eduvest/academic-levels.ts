// Single source of truth for academic classes per workspace.
// Each workspace holds ONE combined, language-stable list (English + French)
// so toggling the UI language never hides data and filters always match.

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

// Combined class lists per workspace. Same list returned regardless of language.
export const LEVELS_BY_WORKSPACE: Record<string, string[]> = {
  "Pre-Nursery": ["Crèche", "Pre-Nursery", "Pré-maternelle"],
  Nursery: [
    "Nursery 1",
    "Nursery 2",
    "Petite Section",
    "Moyenne Section",
    "Grande Section",
  ],
  Primary: [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "SIL",
    "CP",
    "CE1",
    "CE2",
    "CM1",
    "CM2",
  ],
  Secondary: [
    "Form 1",
    "Form 2",
    "Form 3",
    "Form 4",
    "Form 5",
    "6ème",
    "5ème",
    "4ème",
    "3ème",
    "2nde",
  ],
  "Higher Education": ["Lower Sixth", "Upper Sixth", "Première", "Terminale"],
  "Higher Institute": [
    "Level 1",
    "Level 2",
    "Level 3",
    "HND 1",
    "HND 2",
    "BTS 1",
    "BTS 2",
  ],
  University: [
    "Level 1",
    "Level 2",
    "Level 3",
    "Level 4",
    "Masters 1",
    "Masters 2",
    "PhD",
    "Licence 1",
    "Licence 2",
    "Licence 3",
    "Master 1",
    "Master 2",
    "Doctorat",
  ],
};

// Language param kept for backward compatibility — list is now language-stable.
export function getLevels(workspace: string, _lang: Language = "en"): string[] {
  return LEVELS_BY_WORKSPACE[workspace] ?? [];
}

export function getAllWorkspaces(): string[] {
  return Object.keys(LEVELS_BY_WORKSPACE);
}

// Class divisions / streams (A, B, C…). Empty string = no division.
export const DIVISIONS: string[] = ["", "A", "B", "C", "D", "E", "F"];

export function getDivisions(): string[] {
  return DIVISIONS;
}

// Display helper — "Form 1 A" or just "Form 1" when no division.
export function classLabel(level: string, division?: string): string {
  return division ? `${level} ${division}`.trim() : level;
}

// Legacy: kept so older imports keep working. Returns the level unchanged.
export function normalizeLevel(_workspace: string, level: string): string {
  return level;
}
