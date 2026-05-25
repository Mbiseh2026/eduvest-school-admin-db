// Lightweight typed localStorage wrapper.
// Placeholder until backend integration (Lovable Cloud / Supabase).

const isBrowser = () => typeof window !== "undefined";

export function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function removeItem(key: string): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
}
