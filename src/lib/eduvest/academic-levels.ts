// Single source of truth for academic levels per workspace.
// Workspaces are the existing school types. Internal levels here are
// for organization, analytics, communication, printing, search, finance.

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

type LevelMap = { en: string[]; fr: string[] };

const GENERIC_LEVELS = {
  en: ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6"],
  fr: ["Niveau 1", "Niveau 2", "Niveau 3", "Niveau 4", "Niveau 5", "Niveau 6"],
};

export const LEVELS_BY_WORKSPACE: Record<string, LevelMap> = {
  "Pre-Nursery": {
    en: ["Crèche", "Pre-Nursery"],
    fr: ["Crèche", "Pré-maternelle"],
  },
  Nursery: {
    en: ["Nursery 1", "Nursery 2"],
    fr: ["Petite Section", "Moyenne Section", "Grande Section"],
  },
  Primary: {
    en: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6"],
    fr: ["SIL", "CP", "CE1", "CE2", "CM1", "CM2"],
  },
  Secondary: {
    en: [
      "Form 1",
      "Form 2",
      "Form 3",
      "Form 4",
      "Form 5",
      "Lower Sixth",
      "Upper Sixth",
    ],
    fr: ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"],
  },
  "Higher Education": GENERIC_LEVELS,
  "Higher Institute": GENERIC_LEVELS,
  University: {
    en: [
      "Level 1",
      "Level 2",
      "Level 3",
      "Level 4",
      "Level 5",
      "Level 6",
      "Masters 1",
      "Masters 2",
      "PhD",
    ],
    fr: [
      "Niveau 1",
      "Niveau 2",
      "Niveau 3",
      "Niveau 4",
      "Niveau 5",
      "Niveau 6",
      "Master 1",
      "Master 2",
      "Doctorat",
    ],
  },
};

export function getLevels(workspace: string, lang: Language = "en"): string[] {
  const entry = LEVELS_BY_WORKSPACE[workspace];
  if (!entry) return [];
  return entry[lang] ?? entry.en;
}

export function getAllWorkspaces(): string[] {
  return Object.keys(LEVELS_BY_WORKSPACE);
}

// Map a stored class label (any language) back to its canonical English form
// so cross-language data still groups correctly.
export function normalizeLevel(workspace: string, level: string): string {
  const map = LEVELS_BY_WORKSPACE[workspace];
  if (!map) return level;
  const enIdx = map.en.indexOf(level);
  if (enIdx >= 0) return map.en[enIdx];
  const frIdx = map.fr.indexOf(level);
  if (frIdx >= 0) return map.en[frIdx] ?? level;
  return level;
}
