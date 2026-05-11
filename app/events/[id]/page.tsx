"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEvents } from "../../context/EventContext";
import type { Event, EventStatus } from "../../types/Event";

const FORMAT_BADGE: Record<string, { label: string; icon: string }> = {
  presencial: { label: "Presencial", icon: "📍" },
  online: { label: "Online", icon: "💻" },
  hibrido: { label: "Híbrido", icon: "🔗" },
};

const STATUS_CONFIG: Record<EventStatus, { label: string; bg: string; border: string; text: string }> = {
  planeado: { label: "Planeado", bg: "bg-amber-500/10", border: "border-amber-500/25", text: "text-amber-400" },
  ativo: { label: "Ativo", bg: "bg-emerald-500/10", border: "border-emerald-500/25", text: "text-emerald-400" },
  concluido: { label: "Concluído", bg: "bg-sky-500/10", border: "border-sky-500/25", text: "text-sky-400" },
  cancelado: { label: "Cancelado", bg: "bg-red-500/10", border: "border-red-500/25", text: "text-red-400" },
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-PT", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const { events } = useEvents();
  const router = useRouter();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for context to load events from localStorage
    const found = events.find((e) => e.id === id);
    if (found) {
      setEvent(found);
    }
    // Delay slightly to prevent flash of 'not found' while context populates
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, [id, events]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-5 h-5 border-2 border-soft/30 border-t-soft rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold text-light mb-2">Evento não encontrado</h1>
        <p className="text-muted mb-8">O evento que procuras não existe ou foi removido.</p>
        <Link href="/" className="px-6 py-2.5 bg-soft text-dark font-semibold text-sm rounded-full hover:bg-light transition-colors">
          Voltar à página inicial
        </Link>
      </div>
    );
  }

  const fmtBadge = FORMAT_BADGE[event.format] ?? { label: event.format, icon: "📌" };
  const status = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.planeado;
  
  const isCancelled = event.status === "cancelado";
  const isActive = event.status === "ativo";

  const handleRegister = () => {
    alert("Funcionalidade de inscrição em breve!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-soft/[0.08]">
        <Link href="/" className="text-xs font-medium tracking-[0.2em] uppercase text-muted hover:text-soft transition-colors duration-200">
          evently
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-muted hover:text-soft transition-colors duration-200">
            Iniciar sessão
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 sm:px-10 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
        
        {/* Coluna Principal */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          {/* Header do Evento */}
          <div className={`transition-opacity duration-300 ${isCancelled ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${status.bg} ${status.border} ${status.text}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {status.label}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-soft/10 border border-soft/20 text-xs font-medium text-soft">
                {fmtBadge.icon} {fmtBadge.label}
              </span>
            </div>
            <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight mb-4 ${isCancelled ? "text-muted line-through" : "text-light"}`}>
              {event.title}
            </h1>
            <p className="text-base sm:text-lg text-muted/80 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          <div className="w-full h-px bg-soft/[0.08]" />

          {/* Agenda */}
          <div>
            <h2 className="text-xl font-bold text-light mb-6">Agenda</h2>
            {event.agenda && event.agenda.length > 0 ? (
              <div className="flex flex-col gap-4">
                {event.agenda.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-soft/[0.08]">
                    <div className="text-soft font-mono text-sm shrink-0 mt-0.5">{item.time}</div>
                    <div className="text-light font-medium">{item.title}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center rounded-2xl border border-dashed border-soft/20 bg-white/[0.01]">
                <p className="text-muted text-sm">Nenhuma agenda definida para este evento.</p>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Lateral */}
        <div className="lg:col-span-1">
          <div className="sticky top-10 rounded-2xl bg-white/[0.03] border border-soft/[0.12] p-6 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-light mb-6">Resumo</h3>
            
            <div className="flex flex-col gap-5 mb-8">
              <div className="flex gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-soft/10 text-soft flex items-center justify-center text-lg">📅</div>
                <div>
                  <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Data e Hora</p>
                  <p className="text-sm text-light font-medium capitalize">{formatDate(event.date)}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-soft/10 text-soft flex items-center justify-center text-lg">📍</div>
                <div>
                  <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Local</p>
                  <p className="text-sm text-light font-medium">{event.location}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-soft/10 text-soft flex items-center justify-center text-lg">👤</div>
                <div>
                  <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Organização</p>
                  <p className="text-sm text-light font-medium">{event.organizerEmail}</p>
                </div>
              </div>
            </div>

            {isActive ? (
              <button onClick={handleRegister} className="w-full py-3.5 bg-soft text-dark font-semibold text-sm rounded-xl transition-all duration-200 hover:bg-light hover:-translate-y-px cursor-pointer shadow-lg shadow-soft/20">
                Inscrever-me
              </button>
            ) : isCancelled ? (
              <div className="w-full py-3.5 bg-red-500/10 text-red-400 font-semibold text-sm rounded-xl text-center border border-red-500/20">
                Evento cancelado
              </div>
            ) : event.status === "concluido" ? (
              <div className="w-full py-3.5 bg-sky-500/10 text-sky-400 font-semibold text-sm rounded-xl text-center border border-sky-500/20">
                Evento concluído
              </div>
            ) : (
              <div className="w-full py-3.5 bg-white/[0.05] text-muted font-semibold text-sm rounded-xl text-center border border-soft/10">
                Inscrições em breve
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
