import { useCallback, useEffect, useState } from "react";
import { getItem, setItem } from "@/lib/eduvest/storage";

export type Language = "en" | "fr";
const KEY = "eduvest.language";

export function useLanguage() {
  const [lang, setLang] = useState<Language>(() => getItem<Language>(KEY, "en"));
  useEffect(() => { setItem(KEY, lang); }, [lang]);
  const toggle = useCallback(() => setLang((l) => (l === "en" ? "fr" : "en")), []);
  return { lang, setLang, toggle };
}
