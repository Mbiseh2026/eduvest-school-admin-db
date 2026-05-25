import { useCallback, useEffect, useState } from "react";
import { getItem, setItem } from "@/lib/eduvest/storage";

const KEY = "eduvest.workspace";

const DEFAULT = "All School";

export function useWorkspace() {
  // Always start with the default on both server and first client render to avoid hydration mismatch.
  const [workspace, setWs] = useState<string>(DEFAULT);

  useEffect(() => {
    setWs(getItem<string>(KEY, DEFAULT));
    const onStorage = () => setWs(getItem<string>(KEY, DEFAULT));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setWorkspace = useCallback((w: string) => {
    setItem(KEY, w);
    setWs(w);
  }, []);

  return { workspace, setWorkspace };
}
