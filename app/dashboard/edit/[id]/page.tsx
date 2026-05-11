"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useEvents } from "../../../context/EventContext";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const { user } = useAuth();
  const { events, updateEvent } = useEvents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [format, setFormat] = useState<"online" | "presencial" | "hibrido">("presencial");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (events.length > 0 && eventId && user) {
      const eventToEdit = events.find((e) => e.id === eventId);
      
      if (!eventToEdit) {
        setError("Evento não encontrado.");
      } else if (eventToEdit.organizerEmail !== user.email) {
        setError("Não tens permissão para editar este evento.");
      } else {
        setTitle(eventToEdit.title);
        setDescription(eventToEdit.description);
        setDate(eventToEdit.date);
        setLocation(eventToEdit.location);
        setFormat(eventToEdit.format);
      }
      setLoading(false);
    }
  }, [events, eventId, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !description.trim() || !date || !location.trim()) {
      setError("Por favor preenche todos os campos obrigatórios.");
      return;
    }

    const res = updateEvent(eventId, { title, description, date, location, format });
    if (res.ok) {
      setSuccess("Evento atualizado com sucesso!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } else {
      setError(res.error || "Erro ao atualizar evento.");
    }
  };

  if (loading) {
    return <div className="p-8 text-black">A carregar evento...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">Editar Evento</h1>
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          Voltar
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {success ? (
        <div className="bg-green-100 text-green-700 p-6 rounded shadow text-center">
          <p className="text-lg font-medium">{success}</p>
          <p className="text-sm mt-2">A redirecionar...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Título do Evento *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Descrição *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded text-black h-24"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Data e Hora *</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border p-2 rounded text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Formato *</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full border p-2 rounded text-black bg-white"
              >
                <option value="presencial">Presencial</option>
                <option value="online">Online</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Local / Link *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border p-2 rounded text-black"
              placeholder="Morada ou link da reunião"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium disabled:opacity-50"
              disabled={!!error && error.includes("permissão")}
            >
              Guardar Alterações
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
