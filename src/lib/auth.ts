import { create } from "zustand";

interface AuthState {
  user: string | null;
  loading: boolean;
  setUser: (user: string | null) => void;
  setLoading: (loading: boolean) => void;
}

interface LoginResponse {
  ok: boolean;
  user?: string;
  error?: string;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

const BASE = window.location.origin;

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });

  const data = await res.json().catch(() => null);

  if (res.ok && data?.ok) {
    return { ok: true, user: data.user ?? username };
  }

  return {
    ok: false,
    error: data?.error || "Napačno uporabniško ime ali geslo!",
  };
}

export async function logout(): Promise<void> {
  await fetch(`${BASE}/api/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function checkSession(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/api/session`, { credentials: "include" });
    if (!res.ok) return null;

    const data = await res.json().catch(() => null);
    if (data?.authenticated) {
      return data.user ?? "user";
    }

    return null;
  } catch {
    return null;
  }
}
