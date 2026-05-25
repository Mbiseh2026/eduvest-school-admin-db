import { useCallback, useEffect, useState } from "react";
import { getItem, setItem } from "@/lib/eduvest/storage";
import { can, type Permission, type Role } from "@/lib/eduvest/roles";

const KEY = "eduvest.role";
const DEFAULT: Role = "owner";

// Mock role context — backend-driven later.
export function useRole() {
  const [role, setRoleState] = useState<Role>(DEFAULT);

  useEffect(() => {
    setRoleState(getItem<Role>(KEY, DEFAULT));
    const onStorage = () => setRoleState(getItem<Role>(KEY, DEFAULT));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setRole = useCallback((r: Role) => {
    setItem(KEY, r);
    setRoleState(r);
  }, []);

  const has = useCallback((p: Permission) => can(role, p), [role]);

  return { role, setRole, can: has };
}
