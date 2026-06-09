import type { QueryParams } from "@/types";

export type PersonaFilters = QueryParams & {
  projectId: string;
};

export type Persona = {
  id: string;
  projectId: string;
  sessionId: string;
  name: string;
  avgDuration: string;
  uniqueUsers: string;
  rageClickSessions: string;
  ctaConversion: string;
  severity: string;
};
