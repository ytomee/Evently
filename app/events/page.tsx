"use client";

import Link from "next/link";
import { useEvents } from "../context/EventContext";

const FORMAT_BADGE: Record<string, { label: string; icon: string }> = {
  presencial: { label: "Presencial", icon: "📍" },
  online: { label: "Online", icon: "💻" },
  hibrido: { label: "Híbrido", icon: "🔗" },
};

const STATUS_BADGE: Record<string, { label: string; class: string }> = {
  planeado: { label: "Planeado", class: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  ativo: { label: "A Decorrer", class: "bg-green-500/10 text-green-400 border-green-500/20" },
  concluido: { label: "Concluído", class: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  cancelado: { label: "Cancelado", class: "bg-red-500/10 text-red-400 border-red-500/20" },
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

export default function EventsListPage() {
  const { events } = useEvents();

  // Sort events by date descending
  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-soft/[0.08]">
        <Link href="/" className="text-xs font-medium tracking-[0.2em] uppercase text-muted hover:text-soft transition-colors">
          evently
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/dashboard"
            className="text-sm text-muted hover:text-soft transition-colors duration-200 hidden sm:block"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 px-6 sm:px-10 py-10 sm:py-14 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light mb-1">
            Explorar Eventos
          </h1>
          <p className="text-sm text-muted">
            Descobre e participa em eventos da nossa comunidade.
          </p>
        </div>

        {/* Events list */}
        {sortedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-soft/10 border border-soft/20 text-2xl">
              🔍
            </div>
            <h2 className="text-lg font-semibold text-light mb-2">
              Não existem eventos
            </h2>
            <p className="text-sm text-muted max-w-xs mb-8">
              Ainda não existem eventos disponíveis. Volta mais tarde!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedEvents.map((event) => {
              const formatBadge = FORMAT_BADGE[event.format] ?? { label: event.format, icon: "📌" };
              const statusBadge = STATUS_BADGE[event.status] ?? { label: event.status, class: "bg-soft/10 text-soft border-soft/20" };

              return (
                <Link
                  href={`/events/${event.id}`}
                  key={event.id}
                  className="block group bg-white/[0.03] border border-soft/[0.12] rounded-2xl p-5 sm:p-6 backdrop-blur-md transition-all duration-200 hover:border-soft/30 hover:bg-white/[0.05]"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-light mb-1 truncate group-hover:text-soft transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted mt-2">
                        <span className="flex items-center gap-1">
                          <span>📅</span> {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>{formatBadge.icon}</span> {formatBadge.label}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
