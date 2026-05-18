export type EventStatus = "planeado" | "ativo" | "concluido" | "cancelado";

export const EVENT_THEMES = ["Tecnologia", "Arte", "Desporto", "Música", "Negócios", "Saúde", "Educação"];
export const EVENT_TYPES = ["Conferência", "Workshop", "Meetup", "Webinar", "Festival", "Networking"];

export interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string;
  bio?: string;
  organizerEmail?: string;
}

export const MOCK_SPEAKERS: Speaker[] = [
  { id: "spk-1", name: "João Silva", role: "Software Engineer", company: "TechCorp", bio: "Especialista em desenvolvimento de software com 10 anos de experiência." },
  { id: "spk-2", name: "Maria Santos", role: "Product Manager", company: "InovaTech", bio: "Focada na inovação tecnológica e estratégia de produto." },
  { id: "spk-3", name: "Rui Costa", role: "Designer", company: "Criativa", bio: "Especialista em UX/UI e design centrado no utilizador." },
  { id: "spk-4", name: "Ana Pereira", role: "CTO", company: "FutureLabs", bio: "Líder técnica apaixonada por arquitetura de sistemas escaláveis." },
];

export interface AgendaItem {
  id: string;
  date: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  speakerId?: string;
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
