import type { Weekday } from "@/lib/date.util";
import type { QueryParams } from "@/types";

export type PersonaFilters = QueryParams & {
  projectId: string;
};

export interface PersonaSessionSignature {
  minDuration: number;
  maxDuration: number;
  requiresConversion: boolean;
  minRageClicks: number;
}

export interface Persona {
  name: string;
  description: string;
  percentage: number;
  avgSessionDuration: number;
  rageClickRate: number;
  ctaConversionRate: number;
  severity: "critical" | "warning" | "low" | string;
  psychologicalFriction: string;
  affectedPage: string;
  businessImpact: string;
  recommendation: string;
  marketingCampaign: {
    subject: string;
    body: string;
    channel: string;
  };
  sessionSignature: PersonaSessionSignature;
  representativeSessionId: string;
  representativeReplayUrl: string;
}

export interface PersonaAnalysis {
  _id: string;
  totalSessions: number;
  uniqueUsers: number;
  rageClickRate: number;
  ctaConversionRate: number;
  avgSessionDuration: number;
  frictionScore: number;
  topPriority: string;
  generatedAt: string;
  status: string;
  personas: Persona[];
}

export interface PersonaSchedule {
  mode: "automatic" | "manual" | string;
  dayOfWeek?: number;
  enabled: boolean;
}

export interface PersonaAnalysisData {
  sessionCount: number;
  minSessionsRequired: number;
  thresholdMet: boolean;
  schedule: PersonaSchedule;
  isRegenerating: boolean;
  analysis: PersonaAnalysis | null;
}

export type PersonasSettings = {
  projectId: string;
  schedule: { type: "manual" } | { type: "automatic"; weekday: Weekday };
};
