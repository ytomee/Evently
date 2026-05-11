"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useEvents } from "../../context/EventContext";

type Format = "online" | "presencial" | "hibrido";

const FORMAT_OPTIONS: { value: Format; label: string; icon: string }[] = [
  { value: "presencial", label: "Presencial", icon: "📍" },
  { value: "online", label: "Online", icon: "💻" },
  { value: "hibrido", label: "Híbrido", icon: "🔗" },
];

export default function CreateEventPage() {
  const { user, loading } = useAuth();
  const { createEvent } = useEvents();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [format, setFormat] = useState<Format>("presencial");
  const [error, setError] = useState("");

  /* Redirect if not authenticated */
  if (!loading && !user) {
    router.replace("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-5 h-5 border-2 border-soft/30 border-t-soft rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    /* Validate required fields */
    if (!title.trim()) {
      setError("O título é obrigatório.");
      return;
    }
    if (!description.trim()) {
      setError("A descrição é obrigatória.");
      return;
    }
    if (!date) {
      setError("A data é obrigatória.");
      return;
    }
    if (!location.trim()) {
      setError("O local é obrigatório.");
      return;
    }

    const result = createEvent({
      title: title.trim(),
      description: description.trim(),
      date,
      location: location.trim(),
      format,
    });

    if (!result.ok) {
      setError(result.error ?? "Erro ao criar evento.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-soft/[0.08]">
        <Link
          href="/dashboard"
          className="text-xs font-medium tracking-[0.2em] uppercase text-muted hover:text-soft transition-colors duration-200"
        >
          evently
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-muted hover:text-soft transition-colors duration-200"
        >
          ← Voltar
        </Link>
      </nav>

      {/* Form */}
      <main className="flex-1 flex items-start justify-center px-6 py-12 sm:py-16">
        <div className="w-full max-w-lg bg-white/[0.03] border border-soft/[0.12] rounded-2xl p-8 sm:p-10 backdrop-blur-md">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-light mb-1">
              Criar evento
            </h1>
            <p className="text-sm text-muted">
              Preenche os detalhes do teu evento.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="event-title" className="text-xs font-medium text-muted tracking-wide">
                Título *
              </label>
              <input
                id="event-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nome do evento"
                className="w-full px-4 py-3 bg-white/[0.04] border border-soft/[0.15] rounded-xl text-light text-sm placeholder:text-muted/50 outline-none focus:border-soft/50 transition-colors duration-200"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="event-description" className="text-xs font-medium text-muted tracking-wide">
                Descrição *
              </label>
              <textarea
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreve o teu evento..."
                rows={3}
                className="w-full px-4 py-3 bg-white/[0.04] border border-soft/[0.15] rounded-xl text-light text-sm placeholder:text-muted/50 outline-none focus:border-soft/50 transition-colors duration-200 resize-none"
              />
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="event-date" className="text-xs font-medium text-muted tracking-wide">
                Data e hora *
              </label>
              <input
                id="event-date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.04] border border-soft/[0.15] rounded-xl text-light text-sm outline-none focus:border-soft/50 transition-colors duration-200 [color-scheme:dark]"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="event-location" className="text-xs font-medium text-muted tracking-wide">
                Local *
              </label>
              <input
                id="event-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Morada ou link da sala virtual"
                className="w-full px-4 py-3 bg-white/[0.04] border border-soft/[0.15] rounded-xl text-light text-sm placeholder:text-muted/50 outline-none focus:border-soft/50 transition-colors duration-200"
              />
            </div>

            {/* Format */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted tracking-wide">
                Formato *
              </span>
              <div className="grid grid-cols-3 gap-2">
                {FORMAT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormat(opt.value)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                      format === opt.value
                        ? "border-soft/50 bg-soft/10 text-soft"
                        : "border-soft/[0.12] bg-white/[0.02] text-muted hover:border-soft/30 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-xs">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              id="create-event-btn"
              type="submit"
              className="mt-2 w-full py-3.5 bg-soft text-dark font-semibold text-sm rounded-full transition-all duration-200 hover:bg-light hover:-translate-y-px cursor-pointer"
            >
              Criar evento
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
