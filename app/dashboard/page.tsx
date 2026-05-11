"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";

const FORMAT_BADGE: Record<string, { label: string; icon: string }> = {
  presencial: { label: "Presencial", icon: "📍" },
  online: { label: "Online", icon: "💻" },
  hibrido: { label: "Híbrido", icon: "🔗" },
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const { userEvents } = useEvents();
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
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/profile"
            className="text-sm text-muted hover:text-soft transition-colors duration-200 hidden sm:block"
          >
            {user.name}
          </Link>
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
      <main className="flex-1 px-6 sm:px-10 py-10 sm:py-14 max-w-4xl mx-auto w-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light mb-1">
              Os meus eventos
            </h1>
            <p className="text-sm text-muted">
              Gere e acompanha os eventos que criaste.
            </p>
          </div>
          <Link
            id="new-event-btn"
            href="/dashboard/create"
            className="px-6 py-2.5 bg-soft text-dark font-semibold text-sm rounded-full transition-all duration-200 hover:bg-light hover:-translate-y-px whitespace-nowrap"
          >
            + Criar evento
          </Link>
        </div>

        {/* Events list */}
        {userEvents.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-soft/10 border border-soft/20 text-2xl">
              📅
            </div>
            <h2 className="text-lg font-semibold text-light mb-2">
              Ainda não tens eventos
            </h2>
            <p className="text-sm text-muted max-w-xs mb-8">
              Cria o teu primeiro evento e começa a partilhá-lo com os participantes.
            </p>
            <Link
              href="/dashboard/create"
              className="px-7 py-3 bg-soft text-dark font-semibold text-sm rounded-full transition-all duration-200 hover:bg-light hover:-translate-y-px"
            >
              Criar primeiro evento
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {userEvents.map((event) => {
              const badge = FORMAT_BADGE[event.format] ?? { label: event.format, icon: "📌" };
              return (
                <div
                  key={event.id}
                  className="group bg-white/[0.03] border border-soft/[0.12] rounded-2xl p-5 sm:p-6 backdrop-blur-md transition-all duration-200 hover:border-soft/30 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-light mb-1 truncate">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted line-clamp-2 mb-3">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                        <span>📅 {formatDate(event.date)}</span>
                        <span>📍 {event.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-soft/10 border border-soft/20 text-xs font-medium text-soft">
                        {badge.icon} {badge.label}
                      </span>
                      <Link
                        href={`/dashboard/edit/${event.id}`}
                        className="px-3 py-1.5 mt-2 text-xs font-medium rounded-full border border-soft/20 text-soft hover:bg-soft/10 transition-colors"
                      >
                        ✏️ Editar
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
