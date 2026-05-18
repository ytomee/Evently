"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { EVENT_THEMES, EVENT_TYPES } from "../types/Event";

export default function ProfilePage() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [bio, setBio] = useState("");
  
  const [themes, setThemes] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Preenche o formulário com os dados do utilizador
  /* eslint-disable react-hooks/set-state-in-effect -- syncing form fields with user context */
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setContact(user.contact || "");
      setBio(user.bio || "");
      setThemes(user.preferences?.themes || []);
      setTypes(user.preferences?.types || []);
    }
  }, [user]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Redireciona se não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-8 text-center text-black">A carregar...</div>;
  }

  const handleThemeToggle = (theme: string) => {
    setThemes(prev => prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]);
  };

  const handleTypeToggle = (type: string) => {
    setTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !contact.trim()) {
      setError("Os campos Nome e Contacto são obrigatórios e não podem ficar vazios.");
      return;
    }

    updateUser({ 
      name, 
      contact, 
      bio,
      preferences: { themes, types }
    });
    setSuccess("Perfil atualizado com sucesso!");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-12 bg-gray-50">
      <div className="w-full max-w-lg p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">O Meu Perfil</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Nome *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded text-black"
                placeholder="O seu nome"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Contacto *</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full border p-2 rounded text-black"
                placeholder="O seu telefone ou email de contacto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Breve Descrição</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border p-2 rounded text-black h-24"
                placeholder="Fale um pouco sobre si..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-4">Os Meus Interesses</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-black">Temas Favoritos</label>
              <div className="flex flex-wrap gap-2">
                {EVENT_THEMES.map(theme => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => handleThemeToggle(theme)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${themes.includes(theme) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black">Tipos de Evento Favoritos</label>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeToggle(type)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${types.includes(type) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-medium transition-colors mt-6"
          >
            Guardar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
