"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { useEvents } from "../../../context/EventContext";
import type { Event } from "../../../types/Event";

export default function EventCheckinPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading, getRegisteredUsersForEvent } = useAuth();
  const { events, checkInParticipant } = useEvents();

  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
      return;
    }

    if (events.length > 0 && id && user) {
      const found = events.find((e) => e.id === id);
      if (found) {
        if (found.organizerEmail !== user.email) {
          router.replace("/dashboard");
          return;
        }
        setEvent(found);
        setParticipants(getRegisteredUsersForEvent(found.id));
      }
      setLoading(false);
    }
  }, [events, id, user, authLoading, getRegisteredUsersForEvent, router]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-5 h-5 border-2 border-soft/30 border-t-soft rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted">Evento não encontrado.</p>
        <Link href="/dashboard" className="mt-4 text-soft hover:underline">Voltar ao dashboard</Link>
      </div>
    );
  }

  const handleCheckIn = (email: string) => {
    const res = checkInParticipant(event.id, email);
    if (res.ok) {
      setFeedback({ msg: "Check-in realizado com sucesso!", ok: true });
    } else {
      setFeedback({ msg: res.error || "Erro no check-in.", ok: false });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const total = participants.length;
  const checkedInCount = event.checkIns?.length || 0;
  const rate = total > 0 ? Math.round((checkedInCount / total) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-soft/[0.08]">
        <Link href="/dashboard" className="text-xs font-medium tracking-[0.2em] uppercase text-muted hover:text-soft transition-colors duration-200">
          evently
        </Link>
        <Link href="/dashboard" className="text-sm text-muted hover:text-soft transition-colors duration-200">
          ← Voltar ao Dashboard
        </Link>
      </nav>

      <main className="flex-1 px-6 sm:px-10 py-10 sm:py-14 max-w-4xl mx-auto w-full flex flex-col gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-soft/10 text-soft text-xs font-medium rounded-full">Gestão de Presenças</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light mb-2">
            {event.title}
          </h1>
          <p className="text-sm text-muted">Realiza o check-in dos participantes inscritos neste evento.</p>
        </div>

        {feedback && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium ${feedback.ok ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            {feedback.msg}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-soft/[0.12] flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold text-light mb-1">{total}</div>
            <div className="text-xs text-muted uppercase tracking-wider">Inscritos</div>
          </div>
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-soft/[0.12] flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-1">{checkedInCount}</div>
            <div className="text-xs text-muted uppercase tracking-wider">Presentes</div>
          </div>
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-soft/[0.12] flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold text-soft mb-1">{rate}%</div>
            <div className="text-xs text-muted uppercase tracking-wider">Taxa de Presença</div>
          </div>
        </div>

        <div className="rounded-2xl border border-soft/[0.12] overflow-hidden bg-white/[0.02]">
          <div className="px-6 py-4 border-b border-soft/[0.12] bg-white/[0.01]">
            <h2 className="text-base font-semibold text-light">Lista de Participantes</h2>
          </div>
          
          {participants.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-muted text-sm">Ainda não existem participantes inscritos neste evento.</p>
            </div>
          ) : (
            <div className="divide-y divide-soft/[0.08]">
              {participants.map(p => {
                const checkIn = event.checkIns?.find(c => c.userEmail === p.email);
                const isCheckedIn = !!checkIn;
                
                return (
                  <div key={p.email} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <h3 className="text-sm font-semibold text-light">{p.name}</h3>
                      <p className="text-xs text-muted">{p.email}</p>
                    </div>
                    <div>
                      {isCheckedIn ? (
                        <div className="flex flex-col items-end">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ✔ Presente
                          </span>
                          <span className="text-[10px] text-muted mt-1">
                            {new Date(checkIn.timestamp).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCheckIn(p.email)}
                          className="px-4 py-2 bg-soft text-dark font-semibold text-xs rounded-full hover:bg-light transition-colors shadow-sm cursor-pointer"
                        >
                          Fazer Check-in
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
