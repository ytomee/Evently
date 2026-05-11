"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import type { Event } from "../types/Event";

/* ── Types ─────────────────────────────────────────────────────────────── */

type CreateEventInput = Omit<Event, "id" | "organizerEmail" | "createdAt">;

interface EventContextType {
  events: Event[];
  userEvents: Event[];
  createEvent: (data: CreateEventInput) => { ok: boolean; error?: string };
  updateEvent: (id: string, data: Partial<CreateEventInput>) => { ok: boolean; error?: string };
}

/* ── Key ───────────────────────────────────────────────────────────────── */

const EVENTS_KEY = "evently_events";

/* ── Context ───────────────────────────────────────────────────────────── */

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  /* Load events from localStorage on mount */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(EVENTS_KEY);
      if (raw) setEvents(JSON.parse(raw));
    } catch {
      console.error("Failed to load events from storage");
    }
  }, []);

  /* Derived: events belonging to the authenticated user */
  const userEvents = events
    .filter((e) => user && e.organizerEmail === user.email)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  /* Create event */
  const createEvent = useCallback(
    (data: CreateEventInput) => {
      if (!user) return { ok: false, error: "Tens de iniciar sessão." };

      const newEvent: Event = {
        ...data,
        id: crypto.randomUUID(),
        organizerEmail: user.email,
        createdAt: new Date().toISOString(),
      };

      setEvents((prev) => {
        const updated = [...prev, newEvent];
        localStorage.setItem(EVENTS_KEY, JSON.stringify(updated));
        return updated;
      });

      return { ok: true };
    },
    [user]
  );

  /* Update event */
  const updateEvent = useCallback(
    (id: string, data: Partial<CreateEventInput>) => {
      if (!user) return { ok: false, error: "Tens de iniciar sessão." };

      let updatedEvent: Event | undefined;

      setEvents((prev) => {
        const index = prev.findIndex((e) => e.id === id);
        if (index === -1) return prev;

        const event = prev[index];
        // Verifica se o utilizador é o organizador
        if (event.organizerEmail !== user.email) {
          return prev;
        }

        updatedEvent = { ...event, ...data };
        const updated = [...prev];
        updated[index] = updatedEvent;
        
        localStorage.setItem(EVENTS_KEY, JSON.stringify(updated));
        return updated;
      });

      if (!updatedEvent) {
        return { ok: false, error: "Evento não encontrado ou sem permissão para editar." };
      }

      return { ok: true };
    },
    [user]
  );

  return (
    <EventContext.Provider value={{ events, userEvents, createEvent, updateEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEvents must be used inside EventProvider");
  return ctx;
}
