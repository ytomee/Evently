"use client";

import Link from "next/link";
import { useAuth } from "./context/AuthContext";

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 py-16 relative z-10">

      {/* Logotype */}
      <span className="text-xs font-medium tracking-[0.25em] uppercase text-muted mb-10">
        evently
      </span>

      {/* Heading */}
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-center text-light max-w-2xl mb-5">
        Os teus eventos,{" "}
        <span className="text-soft">num só lugar.</span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-muted text-center max-w-sm leading-relaxed mb-12">
        Cria, organiza e partilha eventos com quem mais importa.
      </p>

      {/* CTAs */}
      {!loading && (
        user ? (
          <Link
            href="/dashboard"
            className="px-9 py-3.5 bg-soft text-dark font-semibold text-sm rounded-full transition-all duration-200 hover:bg-light hover:-translate-y-px"
          >
            A minha área
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/register"
              className="px-9 py-3.5 bg-soft text-dark font-semibold text-sm rounded-full transition-all duration-200 hover:bg-light hover:-translate-y-px"
            >
              Criar conta
            </Link>
            <Link
              href="/login"
              className="px-9 py-3.5 border border-soft/20 text-soft font-medium text-sm rounded-full transition-all duration-200 hover:bg-soft/10"
            >
              Entrar
            </Link>
          </div>
        )
      )}

      {/* Decorative rule */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-10 h-px bg-muted/30 rounded-full" />
    </main>
  );
}
