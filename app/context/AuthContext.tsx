"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

/* ── Types ─────────────────────────────────────────────────────────────── */

interface User {
  name: string;
  email: string;
  contact?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

/* ── Keys ──────────────────────────────────────────────────────────────── */

const USERS_KEY = "evently_users";
const SESSION_KEY = "evently_session";

/* ── Context ───────────────────────────────────────────────────────────── */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* Restore session on mount */
  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        setUser(JSON.parse(session));
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Login */
  const login = useCallback((email: string, password: string) => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      const users: { name: string; email: string; password: string }[] = raw
        ? JSON.parse(raw)
        : [];

      const match = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!match) {
        return { ok: false, error: "Email ou palavra-passe incorretos." };
      }

      const sessionUser: User = { name: match.name, email: match.email };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { ok: true };
    } catch {
      return { ok: false, error: "Erro ao iniciar sessão. Tenta novamente." };
    }
  }, []);

  /* Logout */
  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  /* Update User */
  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...data };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
      
      // Update the user inside USERS_KEY array
      try {
        const raw = localStorage.getItem(USERS_KEY);
        if (raw) {
          const users = JSON.parse(raw);
          const index = users.findIndex((u: User) => u.email === prev.email);
          if (index !== -1) {
            users[index] = { ...users[index], ...data };
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
          }
        }
      } catch (err) {
        console.error("Failed to update user in storage", err);
      }
      
      return updatedUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
