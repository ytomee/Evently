"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";
import type { EventStatus } from "../types/Event";

/* ── Badge mappings ────────────────────────────────────────────────────── */

const FORMAT_BADGE: Record<string, { label: string; icon: string }> = {
  presencial: { label: "Presencial", icon: "📍" },
  online: { label: "Online", icon: "💻" },
  hibrido: { label: "Híbrido", icon: "🔗" },
};

const STATUS_CONFIG: Record<
  EventStatus,
  { label: string; bg: string; border: string; text: string }
> = {
  planeado: {
    label: "Planeado",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    text: "text-amber-400",
  },
  ativo: {
    label: "Ativo",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    text: "text-emerald-400",
  },
  concluido: {
    label: "Concluído",
    bg: "bg-sky-500/10",
    border: "border-sky-500/25",
    text: "text-sky-400",
  },
  cancelado: {
    label: "Cancelado",
    bg: "bg-red-500/10",
    border: "border-red-500/25",
    text: "text-red-400",
  },
};

/* Valid transitions — mirrors EventContext */
const VALID_TRANSITIONS: Record<EventStatus, EventStatus[]> = {
  planeado: ["ativo", "cancelado"],
  ativo: ["concluido", "cancelado"],
  concluido: [],
  cancelado: [],
};

/* ── Helpers ───────────────────────────────────────────────────────────── */

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

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const { userEvents, updateEventStatus } = useEvents();
  const router = useRouter();

  /* Track which card has the status dropdown open */
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  /* Flash feedback after status change */
  const [feedback, setFeedback] = useState<{ id: string; msg: string; ok: boolean } | null>(null);

  /* Redirect to login if not authenticated */
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!openDropdown) return;
    const handle = () => setOpenDropdown(null);
    window.addEventListener("click", handle);
    return () => window.removeEventListener("click", handle);
  }, [openDropdown]);

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

  const handleStatusChange = (eventId: string, newStatus: EventStatus) => {
    const result = updateEventStatus(eventId, newStatus);
    if (!result.ok) {
      setFeedback({ id: eventId, msg: result.error ?? "Erro", ok: false });
    } else {
      setFeedback({
        id: eventId,
        msg: `Estado alterado para "${STATUS_CONFIG[newStatus].label}".`,
        ok: true,
      });
    }
    setOpenDropdown(null);
    setTimeout(() => setFeedback(null), 3000);
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
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/speakers"
              className="px-6 py-2.5 bg-white/[0.04] border border-soft/[0.15] text-light font-semibold text-sm rounded-full transition-all duration-200 hover:bg-white/[0.08]"
            >
              👤 Meus oradores
            </Link>
            <Link
              id="new-event-btn"
              href="/dashboard/create"
              className="px-6 py-2.5 bg-soft text-dark font-semibold text-sm rounded-full transition-all duration-200 hover:bg-light hover:-translate-y-px whitespace-nowrap"
            >
              + Criar evento
            </Link>
          </div>
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
              const fmtBadge = FORMAT_BADGE[event.format] ?? { label: event.format, icon: "📌" };
              const status = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.planeado;
              const isCancelled = event.status === "cancelado";
              const isFinal = event.status === "concluido" || isCancelled;
              const transitions = VALID_TRANSITIONS[event.status] ?? [];

              return (
                <div
                  key={event.id}
                  className={`group relative rounded-2xl p-5 sm:p-6 backdrop-blur-md border transition-all duration-200 ${
                    isCancelled
                      ? "bg-red-500/[0.03] border-red-500/20 opacity-70"
                      : "bg-white/[0.03] border-soft/[0.12] hover:border-soft/30 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left — event info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-base font-semibold mb-1 truncate ${
                          isCancelled ? "text-muted line-through" : "text-light"
                        }`}
                      >
                        {event.title}
                      </h3>
                      <p className={`text-sm line-clamp-2 mb-3 ${isCancelled ? "text-muted/60" : "text-muted"}`}>
                        {event.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                        <span>📅 {formatDate(event.date)}</span>
                        <span>📍 {event.location}</span>
                      </div>
                    </div>

                    {/* Right — badges + actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {/* Status badge */}
                      <div className="relative">
                        <button
                          id={`status-btn-${event.id}`}
                          type="button"
                          disabled={isFinal}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === event.id ? null : event.id);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${status.bg} ${status.border} ${status.text} ${
                            isFinal ? "cursor-default" : "cursor-pointer hover:brightness-125"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {status.label}
                          {!isFinal && (
                            <svg className="w-3 h-3 ml-0.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>

                        {/* Status dropdown */}
                        {openDropdown === event.id && transitions.length > 0 && (
                          <div
                            className="absolute right-0 top-full mt-1 z-20 min-w-[160px] bg-neutral-800 border border-soft/20 rounded-xl shadow-xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="px-3 py-2 text-[10px] font-medium uppercase tracking-widest text-muted/60 border-b border-soft/10">
                              Alterar estado
                            </div>
                            {transitions.map((t) => {
                              const tCfg = STATUS_CONFIG[t];
                              return (
                                <button
                                  key={t}
                                  id={`status-option-${event.id}-${t}`}
                                  type="button"
                                  onClick={() => handleStatusChange(event.id, t)}
                                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors duration-150 hover:bg-white/[0.06] cursor-pointer ${tCfg.text}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${tCfg.bg.replace("/10", "/60")}`} style={{ backgroundColor: "currentColor" }} />
                                  {tCfg.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Format badge */}
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-soft/10 border border-soft/20 text-xs font-medium text-soft">
                        {fmtBadge.icon} {fmtBadge.label}
                      </span>

                      {/* View & Edit links */}
                      <div className="flex items-center gap-2 mt-1">
                        <Link
                          href={`/events/${event.id}`}
                          className="px-3 py-1.5 text-xs font-medium rounded-full border border-soft/20 text-soft hover:bg-soft/10 transition-colors"
                        >
                          👁️ Ver página
                        </Link>
                        {!isCancelled && (
                          <Link
                            href={`/dashboard/edit/${event.id}`}
                            className="px-3 py-1.5 text-xs font-medium rounded-full border border-soft/20 text-soft hover:bg-soft/10 transition-colors"
                          >
                            ✏️ Editar
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Inline feedback */}
                  {feedback && feedback.id === event.id && (
                    <div
                      className={`mt-3 px-3 py-2 rounded-lg text-xs font-medium transition-opacity duration-300 ${
                        feedback.ok
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : "bg-red-500/10 border border-red-500/20 text-red-400"
                      }`}
                    >
                      {feedback.msg}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
