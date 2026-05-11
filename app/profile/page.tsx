"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [bio, setBio] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Preenche o formulário com os dados do utilizador
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setContact(user.contact || "");
      setBio(user.bio || "");
    }
  }, [user]);

  // Redireciona se não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-8 text-center text-black">A carregar...</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !contact.trim()) {
      setError("Os campos Nome e Contacto são obrigatórios e não podem ficar vazios.");
      return;
    }

    updateUser({ name, contact, bio });
    setSuccess("Perfil atualizado com sucesso!");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
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

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium transition-colors"
          >
            Guardar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
