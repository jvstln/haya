import type { Weekday } from "@/lib/date.util";
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

export type PersonasSettings = {
  projectId: string;
  schedule: { type: "manual" } | { type: "automatic"; weekday: Weekday };
};
