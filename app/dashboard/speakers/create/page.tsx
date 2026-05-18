"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { useEvents } from "../../../context/EventContext";

export default function CreateSpeakerPage() {
  const { user, loading } = useAuth();
  const { createSpeaker } = useEvents();
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

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

    if (!name.trim() || !role.trim() || !company.trim() || !bio.trim()) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    const res = createSpeaker({
      name: name.trim(),
      role: role.trim(),
      company: company.trim(),
      bio: bio.trim(),
    });

    if (!res.ok) {
      setError(res.error || "Erro ao adicionar orador.");
      return;
    }

    router.push("/dashboard/speakers");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-soft/[0.08]">
        <Link href="/dashboard" className="text-xs font-medium tracking-[0.2em] uppercase text-muted hover:text-soft transition-colors duration-200">
          evently
        </Link>
        <Link href="/dashboard/speakers" className="text-sm text-muted hover:text-soft transition-colors duration-200">
          ← Voltar
        </Link>
      </nav>

      <main className="flex-1 flex items-start justify-center px-6 py-12 sm:py-16">
        <div className="w-full max-w-lg bg-white/[0.03] border border-soft/[0.12] rounded-2xl p-8 sm:p-10 backdrop-blur-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-light mb-1">
              Adicionar orador
            </h1>
            <p className="text-sm text-muted">
              Regista um orador para o associares aos teus eventos.
            </p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-medium text-muted tracking-wide">Nome *</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ana Silva"
                className="w-full px-4 py-3 bg-white/[0.04] border border-soft/[0.15] rounded-xl text-light text-sm outline-none focus:border-soft/50 transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="role" className="text-xs font-medium text-muted tracking-wide">Cargo *</label>
                <input
                  id="role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: CTO"
                  className="w-full px-4 py-3 bg-white/[0.04] border border-soft/[0.15] rounded-xl text-light text-sm outline-none focus:border-soft/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="company" className="text-xs font-medium text-muted tracking-wide">Empresa *</label>
                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ex: TechCorp"
                  className="w-full px-4 py-3 bg-white/[0.04] border border-soft/[0.15] rounded-xl text-light text-sm outline-none focus:border-soft/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="bio" className="text-xs font-medium text-muted tracking-wide">Biografia *</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Breve biografia do orador..."
                rows={4}
                className="w-full px-4 py-3 bg-white/[0.04] border border-soft/[0.15] rounded-xl text-light text-sm outline-none focus:border-soft/50 transition-colors resize-none"
              />
            </div>

            <button type="submit" className="mt-4 w-full py-3.5 bg-soft text-dark font-semibold text-sm rounded-full transition-all duration-200 hover:bg-light hover:-translate-y-px cursor-pointer">
              Guardar orador
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
