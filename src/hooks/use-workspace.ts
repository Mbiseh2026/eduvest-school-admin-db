import { useCallback, useEffect, useState } from "react";
import { getItem, setItem } from "@/lib/eduvest/storage";

const KEY = "eduvest.workspace";

export function useWorkspace() {
  const [workspace, setWs] = useState<string>(() => getItem<string>(KEY, "All School"));

  useEffect(() => {
    const onStorage = () => setWs(getItem<string>(KEY, "All School"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setWorkspace = useCallback((w: string) => {
    setItem(KEY, w);
    setWs(w);
  }, []);

  return { workspace, setWorkspace };
}
