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
  { id: "spk-1", name: "João Silva", role: "Software Engineer", company: "TechCorp", bio: "O João é um engenheiro de software com mais de 10 anos de experiência em sistemas distribuídos e arquiteturas de microserviços. É apaixonado por código limpo e mentor assíduo na comunidade open-source." },
  { id: "spk-2", name: "Maria Santos", role: "Product Manager", company: "InovaTech", bio: "A Maria lidera o desenvolvimento de produtos inovadores focados na usabilidade e impacto social. Com formação em design e gestão, a sua abordagem coloca sempre o utilizador no centro da estratégia." },
  { id: "spk-3", name: "Rui Costa", role: "Designer", company: "Criativa", bio: "O Rui é um Designer de Produto especializado em criar interfaces elegantes e intuitivas. O seu trabalho destaca-se pelo detalhe estético e por uma forte preocupação com a acessibilidade em plataformas digitais." },
  { id: "spk-4", name: "Ana Pereira", role: "CTO", company: "FutureLabs", bio: "A Ana é Chief Technology Officer na FutureLabs, onde impulsiona as mais recentes inovações na área de inteligência artificial. Tem um doutoramento em Ciência da Computação e um vasto currículo em I&D." },
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
