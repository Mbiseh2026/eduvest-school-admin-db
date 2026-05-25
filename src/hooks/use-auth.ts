import { useCallback, useEffect, useState } from "react";
import { getItem, setItem, removeItem } from "@/lib/eduvest/storage";

// Mock auth — placeholder until backend integration.
export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  onboarded: boolean;
};

const KEY = "eduvest.auth.user";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getItem<AuthUser | null>(KEY, null));

  useEffect(() => {
    const onStorage = () => setUser(getItem<AuthUser | null>(KEY, null));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signUp = useCallback(async (input: { email: string; fullName: string; password: string }) => {
    const u: AuthUser = {
      id: crypto.randomUUID(),
      email: input.email,
      fullName: input.fullName,
      onboarded: false,
    };
    setItem(KEY, u);
    setUser(u);
    return u;
  }, []);

  const signIn = useCallback(async (input: { email: string; password: string }) => {
    const existing = getItem<AuthUser | null>(KEY, null);
    const u: AuthUser = existing ?? {
      id: crypto.randomUUID(),
      email: input.email,
      fullName: input.email.split("@")[0],
      onboarded: false,
    };
    setItem(KEY, u);
    setUser(u);
    return u;
  }, []);

  const signOut = useCallback(() => {
    removeItem(KEY);
    setUser(null);
  }, []);

  const markOnboarded = useCallback(() => {
    const current = getItem<AuthUser | null>(KEY, null);
    if (!current) return;
    const next = { ...current, onboarded: true };
    setItem(KEY, next);
    setUser(next);
  }, []);

  return { user, signUp, signIn, signOut, markOnboarded };
}
