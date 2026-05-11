"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    const result = login(email.trim(), password);

    if (!result.ok) {
      setError(result.error ?? "Erro desconhecido.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-md bg-white/[0.03] border border-soft/[0.12] rounded-2xl p-10 backdrop-blur-md">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs font-medium tracking-[0.2em] uppercase text-muted hover:text-soft transition-colors duration-200 block mb-7"
          >
            evently
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-light mb-1">Iniciar sessão</h1>
          <p className="text-sm text-muted">Bem-vindo de volta.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-xs font-medium text-muted tracking-wide">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              autoComplete="email"
              className="w-full px-4 py-3 bg-white/[0.04] border border-soft/[0.15] rounded-xl text-light text-sm placeholder:text-muted/50 outline-none focus:border-soft/50 transition-colors duration-200"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-xs font-medium text-muted tracking-wide">
              Palavra-passe
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="A tua palavra-passe"
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-white/[0.04] border border-soft/[0.15] rounded-xl text-light text-sm placeholder:text-muted/50 outline-none focus:border-soft/50 transition-colors duration-200"
            />
          </div>

          <button
            id="login-btn"
            type="submit"
            className="mt-1 w-full py-3.5 bg-soft text-dark font-semibold text-sm rounded-full transition-all duration-200 hover:bg-light hover:-translate-y-px cursor-pointer"
          >
            Entrar
          </button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-muted">
          Não tens conta?{" "}
          <Link href="/register" className="text-soft hover:text-light transition-colors duration-200">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
