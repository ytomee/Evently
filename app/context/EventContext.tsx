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
import type { Event, EventStatus } from "../types/Event";

/* ── Types ─────────────────────────────────────────────────────────────── */

type CreateEventInput = Omit<Event, "id" | "organizerEmail" | "createdAt" | "status">;

interface EventContextType {
  events: Event[];
  userEvents: Event[];
  createEvent: (data: CreateEventInput) => { ok: boolean; error?: string };
  updateEvent: (id: string, data: Partial<CreateEventInput>) => { ok: boolean; error?: string };
  updateEventStatus: (id: string, status: EventStatus) => { ok: boolean; error?: string };
}

/* ── Valid status transitions ──────────────────────────────────────────── */

const VALID_TRANSITIONS: Record<EventStatus, EventStatus[]> = {
  planeado:  ["ativo", "cancelado"],
  ativo:     ["concluido", "cancelado"],
  concluido: [],                          // estado final
  cancelado: [],                          // estado final
};

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
      if (raw) {
        const parsed: Event[] = JSON.parse(raw);
        // Migrate old events without status
        const migrated = parsed.map((e) => ({
          ...e,
          status: e.status ?? "planeado",
        })) as Event[];
        setEvents(migrated);
      }
    } catch {
      console.error("Failed to load events from storage");
    }
  }, []);

  /* Derived: events belonging to the authenticated user */
  const userEvents = events
    .filter((e) => user && e.organizerEmail === user.email)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  /* Create event — always starts as "planeado" */
  const createEvent = useCallback(
    (data: CreateEventInput) => {
      if (!user) return { ok: false, error: "Tens de iniciar sessão." };

      const newEvent: Event = {
        ...data,
        id: crypto.randomUUID(),
        status: "planeado",
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

  /* Update event fields */
  const updateEvent = useCallback(
    (id: string, data: Partial<CreateEventInput>) => {
      if (!user) return { ok: false, error: "Tens de iniciar sessão." };

      let updatedEvent: Event | undefined;

      setEvents((prev) => {
        const index = prev.findIndex((e) => e.id === id);
        if (index === -1) return prev;

        const event = prev[index];
        if (event.organizerEmail !== user.email) return prev;

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

  /* Update event status — with transition validation */
  const updateEventStatus = useCallback(
    (id: string, newStatus: EventStatus) => {
      if (!user) return { ok: false, error: "Tens de iniciar sessão." };

      const event = events.find((e) => e.id === id);
      if (!event) return { ok: false, error: "Evento não encontrado." };
      if (event.organizerEmail !== user.email) return { ok: false, error: "Sem permissão." };

      const allowed = VALID_TRANSITIONS[event.status];
      if (!allowed.includes(newStatus)) {
        return {
          ok: false,
          error: `Não é possível alterar de "${event.status}" para "${newStatus}".`,
        };
      }

      setEvents((prev) => {
        const index = prev.findIndex((e) => e.id === id);
        if (index === -1) return prev;

        const updated = [...prev];
        updated[index] = { ...updated[index], status: newStatus };
        localStorage.setItem(EVENTS_KEY, JSON.stringify(updated));
        return updated;
      });

      return { ok: true };
    },
    [user, events]
  );

  return (
    <EventContext.Provider value={{ events, userEvents, createEvent, updateEvent, updateEventStatus }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEvents must be used inside EventProvider");
  return ctx;
}
