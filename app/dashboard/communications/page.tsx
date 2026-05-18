"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

export default function CommunicationsPage() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-5 h-5 border-2 border-soft/30 border-t-soft rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const markAsRead = (id: string) => {
    if (!user.communications) return;
    const updated = user.communications.map(c => 
      c.id === id ? { ...c, read: true } : c
    );
    updateUser({ communications: updated });
  };

  const markAllAsRead = () => {
    if (!user.communications) return;
    const updated = user.communications.map(c => ({ ...c, read: true }));
    updateUser({ communications: updated });
  };

  const comms = user.communications || [];
  const unreadCount = comms.filter(c => !c.read).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-soft/[0.08]">
        <Link href="/dashboard" className="text-xs font-medium tracking-[0.2em] uppercase text-muted hover:text-soft transition-colors duration-200">
          evently
        </Link>
        <Link href="/dashboard" className="text-sm text-muted hover:text-soft transition-colors duration-200">
          ← Voltar ao Dashboard
        </Link>
      </nav>

      {/* Content */}
      <main className="flex-1 px-6 sm:px-10 py-10 sm:py-14 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light mb-1">
              Histórico de Comunicações
            </h1>
            <p className="text-sm text-muted">
              Consulta as mensagens e confirmações do sistema.
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-xs font-medium bg-soft/10 text-soft rounded-full hover:bg-soft/20 transition-colors"
            >
              Marcar tudo como lido
            </button>
          )}
        </div>

        {comms.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-dashed border-soft/20 bg-white/[0.01]">
            <div className="text-4xl mb-4 opacity-50">📬</div>
            <p className="text-muted text-sm">Não tens mensagens no histórico.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {comms.map(comm => (
              <div 
                key={comm.id} 
                className={`relative p-5 sm:p-6 rounded-2xl border transition-colors ${
                  comm.read 
                    ? "bg-white/[0.02] border-soft/[0.08]" 
                    : "bg-soft/[0.05] border-soft/[0.2] shadow-sm"
                }`}
              >
                {!comm.read && (
                  <span className="absolute top-6 right-6 w-2.5 h-2.5 bg-soft rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"></span>
                )}
                
                <div className="flex items-center gap-3 mb-3 pr-8">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg shrink-0">
                    ✉
                  </div>
                  <div>
                    <h3 className={`text-base ${comm.read ? "font-medium text-light/80" : "font-bold text-light"}`}>
                      {comm.title}
                    </h3>
                    <p className="text-xs text-muted">
                      {new Date(comm.date).toLocaleDateString("pt-PT", {
                        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
                
                <p className={`text-sm leading-relaxed pl-13 ${comm.read ? "text-muted" : "text-light/90"}`}>
                  {comm.message}
                </p>

                {!comm.read && (
                  <div className="mt-4 pl-13">
                    <button 
                      onClick={() => markAsRead(comm.id)}
                      className="text-xs font-medium text-soft hover:underline"
                    >
                      Marcar como lido
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
