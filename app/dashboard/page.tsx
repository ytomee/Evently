"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  /* Redirect to login if not authenticated */
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-5 h-5 border-2 border-soft/30 border-t-soft rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-soft/[0.08]">
        <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted">
          evently
        </span>
        <div className="flex items-center gap-5">
          <span className="text-sm text-muted hidden sm:block">
            {user.name}
          </span>
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="px-5 py-2 text-xs font-medium rounded-full border border-soft/20 text-soft hover:bg-soft/10 transition-colors duration-200 cursor-pointer"
          >
            Terminar sessão
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-soft/10 border border-soft/20 text-soft text-xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light mb-2">
            Olá, {user.name.split(" ")[0]}
          </h1>
          <p className="text-muted text-sm leading-relaxed">
            A tua área pessoal. Em breve poderás gerir os teus eventos aqui.
          </p>
        </div>
      </main>
    </div>
  );
}
