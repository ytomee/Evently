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
import type { Event, EventStatus, Speaker } from "../types/Event";
import { MOCK_SPEAKERS } from "../types/Event";

/* ── Types ─────────────────────────────────────────────────────────────── */

type CreateEventInput = Omit<Event, "id" | "organizerEmail" | "createdAt" | "status">;

interface EventContextType {
  events: Event[];
  userEvents: Event[];
  speakers: Speaker[];
  userSpeakers: Speaker[];
  createEvent: (data: CreateEventInput) => { ok: boolean; error?: string };
  updateEvent: (id: string, data: Partial<CreateEventInput>) => { ok: boolean; error?: string };
  updateEventStatus: (id: string, status: EventStatus) => { ok: boolean; error?: string };
  createSpeaker: (data: Omit<Speaker, "id" | "organizerEmail">) => { ok: boolean; error?: string };
  checkInParticipant: (eventId: string, userEmail: string) => { ok: boolean; error?: string };
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
const SPEAKERS_KEY = "evently_speakers";

/* ── Context ───────────────────────────────────────────────────────────── */

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>(MOCK_SPEAKERS);

  /* Load events from localStorage on mount */
  /* eslint-disable react-hooks/set-state-in-effect -- hydrating from localStorage on mount */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(EVENTS_KEY);
      if (raw) {
        const parsed: Event[] = JSON.parse(raw);
        const migrated = parsed.map((e) => ({
          ...e,
          status: e.status ?? "planeado",
        })) as Event[];
        setEvents(migrated);
      }
      
      const rawSpeakers = localStorage.getItem(SPEAKERS_KEY);
      if (rawSpeakers) {
        const parsedSpeakers: Speaker[] = JSON.parse(rawSpeakers);
        const allSpeakers = [...MOCK_SPEAKERS];
        for (const s of parsedSpeakers) {
          if (!allSpeakers.find(m => m.id === s.id)) {
            allSpeakers.push(s);
          }
        }
        setSpeakers(allSpeakers);
      }
    } catch {
      console.error("Failed to load data from storage");
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* Derived: events belonging to the authenticated user */
  const userEvents = events
    .filter((e) => user && e.organizerEmail === user.email)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const userSpeakers = speakers.filter((s) => user && s.organizerEmail === user.email);

  const createSpeaker = useCallback((data: Omit<Speaker, "id" | "organizerEmail">) => {
    if (!user) return { ok: false, error: "Tens de iniciar sessão." };

    const newSpeaker: Speaker = {
      ...data,
      id: crypto.randomUUID(),
      organizerEmail: user.email,
    };

    setSpeakers((prev) => {
      const updated = [...prev, newSpeaker];
      localStorage.setItem(SPEAKERS_KEY, JSON.stringify(updated.filter(s => s.organizerEmail)));
      return updated;
    });

    return { ok: true };
  }, [user]);

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

  const checkInParticipant = useCallback((eventId: string, userEmail: string) => {
    if (!user) return { ok: false, error: "Tens de iniciar sessão." };

    let updatedEvent: Event | undefined;

    setEvents((prev) => {
      const index = prev.findIndex((e) => e.id === eventId);
      if (index === -1) return prev;

      const event = prev[index];
      if (event.organizerEmail !== user.email) return prev;

      if (event.checkIns?.some((c) => c.userEmail === userEmail)) return prev;

      const newCheckIn = { userEmail, timestamp: new Date().toISOString() };
      updatedEvent = { 
        ...event, 
        checkIns: [...(event.checkIns || []), newCheckIn] 
      };

      const updated = [...prev];
      updated[index] = updatedEvent;

      localStorage.setItem(EVENTS_KEY, JSON.stringify(updated));
      return updated;
    });

    if (!updatedEvent) return { ok: false, error: "Erro ao fazer check-in." };

    return { ok: true };
  }, [user]);

  return (
    <EventContext.Provider value={{ events, userEvents, speakers, userSpeakers, createEvent, updateEvent, updateEventStatus, createSpeaker, checkInParticipant }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEvents must be used inside EventProvider");
  return ctx;
}
