"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEvents } from "../../context/EventContext";

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

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { events } = useEvents();
  const [loading, setLoading] = useState(true);

  const event = events.find((e) => e.id === id);

  useEffect(() => {
    // Wait a tick to allow events to load from context if needed
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, [events]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-5 h-5 border-2 border-soft/30 border-t-soft rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-4">😢</div>
        <h1 className="text-2xl font-bold text-light mb-2">Evento não encontrado</h1>
        <p className="text-muted mb-8">O evento que procuras não existe ou foi removido.</p>
        <button 
          onClick={() => router.back()}
          className="px-6 py-2 bg-soft/10 text-soft hover:bg-soft/20 rounded-full transition-colors"
        >
          Voltar atrás
        </button>
      </div>
    );
  }

  const formatBadge = FORMAT_BADGE[event.format] ?? { label: event.format, icon: "📌" };
  const statusBadge = STATUS_BADGE[event.status] ?? { label: event.status, class: "bg-soft/10 text-soft border-soft/20" };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center px-6 sm:px-10 py-5 border-b border-soft/[0.08]">
        <button 
          onClick={() => router.back()}
          className="text-sm font-medium text-muted hover:text-soft transition-colors flex items-center gap-2"
        >
          <span>&larr;</span> Voltar
        </button>
      </nav>

      {/* Content */}
      <main className="flex-1 px-6 sm:px-10 py-10 sm:py-14 max-w-3xl mx-auto w-full">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${statusBadge.class}`}>
            {statusBadge.label}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-soft/10 border border-soft/20 text-xs font-medium text-soft">
            {formatBadge.icon} {formatBadge.label}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-light mb-4">
          {event.title}
        </h1>
        
        <div className="flex items-center text-sm text-muted mb-10 gap-2">
          <span>Criado por</span>
          <span className="font-medium text-light">{event.organizerEmail}</span>
        </div>

        <div className="bg-white/[0.03] border border-soft/[0.12] rounded-2xl p-6 sm:p-8 backdrop-blur-md mb-8">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-4">Detalhes</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-muted mb-1">Data e Hora</div>
              <div className="text-light font-medium capitalize">{formatDate(event.date)}</div>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Local / Link</div>
              <div className="text-light font-medium truncate">{event.location}</div>
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none mb-12">
          <h2 className="text-xl font-semibold text-light mb-4">Sobre o evento</h2>
          <p className="text-muted leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </div>

      </main>
    </div>
  );
}
