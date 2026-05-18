export type EventStatus = "planeado" | "ativo" | "concluido" | "cancelado";

export const EVENT_THEMES = ["Tecnologia", "Arte", "Desporto", "Música", "Negócios", "Saúde", "Educação"];
export const EVENT_TYPES = ["Conferência", "Workshop", "Meetup", "Webinar", "Festival", "Networking"];

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;           // ISO string (datetime-local)
  location: string;
  format: "online" | "presencial" | "hibrido";
  theme?: string;
  type?: string;
  status: EventStatus;
  organizerEmail: string;
  agenda?: AgendaItem[];
  createdAt: string;      // ISO string
}
