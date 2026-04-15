import { create } from "zustand";

interface AuthState {
  user: string | null;
  loading: boolean;
  setUser: (user: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

const BASE = window.location.origin;

export async function login(username: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    body: formData,
    credentials: "include",
    redirect: "manual",
  });

  // Flask-Login redirects on success (302), returns 200 with flash on failure
  if (res.type === "opaqueredirect" || res.status === 302 || res.redirected) {
    return { ok: true };
  }

  return { ok: false, error: "Napačno uporabniško ime ali geslo!" };
}

export async function logout(): Promise<void> {
  await fetch(`${BASE}/logout`, { credentials: "include" });
}

export async function checkSession(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/api/files`, { credentials: "include" });
    if (res.ok) return "user";
    return null;
  } catch {
    return null;
  }
}
