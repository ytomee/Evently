"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEvents } from "../../context/EventContext";
import { MOCK_SPEAKERS } from "../../types/Event";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-PT", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function SpeakerProfilePage() {
  const { id } = useParams();
  const { events } = useEvents();
  const router = useRouter();

  const speaker = MOCK_SPEAKERS.find((s) => s.id === id);

  if (!speaker) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold text-light mb-2">Orador não encontrado</h1>
        <p className="text-muted mb-8">O orador que procuras não existe ou o ID está incorreto.</p>
        <button onClick={() => router.back()} className="px-6 py-2.5 bg-soft text-dark font-semibold text-sm rounded-full hover:bg-light transition-colors">
          Voltar
        </button>
      </div>
    );
  }

  // Find associated sessions
  const associatedSessions = events.flatMap((event) => 
    (event.agenda || [])
      .filter((session) => session.speakerId === speaker.id)
      .map((session) => ({
        ...session,
        eventId: event.id,
        eventName: event.title,
        eventStatus: event.status,
      }))
  ).sort((a, b) => {
    // Sort by date descending
    if (a.date !== b.date) return (b.date || "").localeCompare(a.date || "");
    return b.startTime.localeCompare(a.startTime);
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-soft/[0.08]">
        <Link href="/" className="text-xs font-medium tracking-[0.2em] uppercase text-muted hover:text-soft transition-colors duration-200">
          evently
        </Link>
        <button onClick={() => router.back()} className="text-sm text-muted hover:text-soft transition-colors duration-200">
          ← Voltar
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 sm:px-10 py-12 sm:py-16">
        
        {/* Perfil Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-full bg-soft/10 border border-soft/20 flex items-center justify-center text-4xl sm:text-5xl">
            👤
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-light mb-2">
              {speaker.name}
            </h1>
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-white/[0.05] border border-soft/[0.1] rounded-full text-xs font-medium text-soft">
                {speaker.role}
              </span>
              <span className="text-muted text-sm">
                na <span className="text-light font-medium">{speaker.company}</span>
              </span>
            </div>
            {speaker.bio && (
              <p className="text-base text-muted/90 leading-relaxed whitespace-pre-wrap max-w-2xl">
                {speaker.bio}
              </p>
            )}
          </div>
        </div>

        <div className="w-full h-px bg-soft/[0.08] mb-12" />

        {/* Sessões Associadas */}
        <div>
          <h2 className="text-xl font-bold text-light mb-6 flex items-center gap-2">
            <span>📅</span> Sessões Associadas
          </h2>
          
          {associatedSessions.length > 0 ? (
            <div className="grid gap-4">
              {associatedSessions.map((session, idx) => (
                <Link 
                  key={`${session.id}-${idx}`}
                  href={`/events/${session.eventId}`}
                  className="group flex flex-col sm:flex-row gap-4 p-5 rounded-xl bg-white/[0.02] border border-soft/[0.08] hover:border-soft/30 hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex flex-col justify-start shrink-0 sm:w-48 sm:border-r border-soft/[0.08] sm:pr-4">
                    <span className="text-xs font-semibold text-soft uppercase tracking-wider mb-1">
                      {session.date ? formatDate(session.date) : "Sem data"}
                    </span>
                    <span className="text-muted font-mono text-sm">
                      {session.startTime} - {session.endTime}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1 w-full">
                    <h3 className="text-light font-semibold text-lg group-hover:text-soft transition-colors">
                      {session.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-soft/50"></span>
                      Evento: <span className="font-medium text-light/80">{session.eventName}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center rounded-2xl border border-dashed border-soft/20 bg-white/[0.01]">
              <div className="text-3xl mb-3">🎤</div>
              <p className="text-muted text-sm">Este orador não tem sessões agendadas de momento.</p>
            </div>
          )}
        </div>
        
      </main>
    </div>
  );
}
