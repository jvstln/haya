import type z from "zod";
import type { QueryParams } from "@/types";
import type { Session } from "../project-sessions/project-session.type";
import type { newProjectSchema, projectSettingsSchema } from "./project.schema";

export type NewProject = z.infer<typeof newProjectSchema>;
export type NewProjectInput = z.input<typeof newProjectSchema>;

export type Project = {
  _id: string;
  name: string;
  domain: string;
  ownerId: string;
  sdkKey: string;
  isActive: boolean;
  settings: {
    sessionReplay: boolean;
    heatmaps: boolean;
    trackClicks: boolean;
    trackScrolls: boolean;
    trackMousemove: boolean;
    maskInputs: boolean;
  };
  createdAt: string;
  updatedAt: string;
  hmacSecret?: string;
};

export type ProjectOverview = {
  totalSessions: number;
  totalEvents: number;
  replayReadySessions: number;
  topPages: Array<{
    views: number;
    page: string;
  }>;
  eventBreakdown: Array<{
    count: number;
    type: "pageview";
  }>;
};

export type ProjectFilters = QueryParams & {};

export type ProjectSettings = z.infer<typeof projectSettingsSchema>;

export type SessionDetailed = Session;

export type SessionEvent = {
  _id: string;
  type: string;
  payload: {
    url: string;
    referrer: string;
  };
  pageUrl: string;
  timestamp: number;
};

export type SessionFilter = QueryParams & {
  projectId: string;
};
