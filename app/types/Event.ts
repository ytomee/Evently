export type EventStatus = "planeado" | "ativo" | "concluido" | "cancelado";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;           // ISO string (datetime-local)
  location: string;
  format: "online" | "presencial" | "hibrido";
  status: EventStatus;
  organizerEmail: string;
  createdAt: string;      // ISO string
}
