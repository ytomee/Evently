"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useEvents } from "../../context/EventContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SpeakersPage() {
  const { user, loading } = useAuth();
  const { userSpeakers } = useEvents();
  const router = useRouter();

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

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-soft/[0.08]">
        <Link href="/dashboard" className="text-xs font-medium tracking-[0.2em] uppercase text-muted hover:text-soft transition-colors duration-200">
          evently
        </Link>
        <Link href="/dashboard" className="text-sm text-muted hover:text-soft transition-colors duration-200">
          ← Voltar
        </Link>
      </nav>

      <main className="flex-1 px-6 sm:px-10 py-10 sm:py-14 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light mb-1">
              Meus oradores
            </h1>
            <p className="text-sm text-muted">
              Gere os oradores para associares às tuas sessões.
            </p>
          </div>
          <Link
            href="/dashboard/speakers/create"
            className="px-6 py-2.5 bg-soft text-dark font-semibold text-sm rounded-full transition-all duration-200 hover:bg-light hover:-translate-y-px whitespace-nowrap"
          >
            + Adicionar orador
          </Link>
        </div>

        {userSpeakers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-soft/10 border border-soft/20 text-2xl">
              👤
            </div>
            <h2 className="text-lg font-semibold text-light mb-2">Ainda não tens oradores</h2>
            <p className="text-sm text-muted max-w-xs mb-8">Adiciona o teu primeiro orador para o associares aos teus eventos.</p>
            <Link
              href="/dashboard/speakers/create"
              className="px-7 py-3 bg-soft text-dark font-semibold text-sm rounded-full transition-all duration-200 hover:bg-light hover:-translate-y-px"
            >
              Adicionar orador
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userSpeakers.map(spk => (
              <div key={spk.id} className="p-5 rounded-2xl bg-white/[0.03] border border-soft/[0.12] hover:border-soft/30 transition-colors">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-soft/10 text-soft rounded-full text-xl font-bold">
                    {spk.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-light">{spk.name}</h3>
                    <p className="text-xs text-muted font-medium">{spk.role} @ {spk.company}</p>
                  </div>
                </div>
                {spk.bio && <p className="text-sm text-muted/80 line-clamp-3">{spk.bio}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
