import { api } from "@/lib/api";
import type { Pagination } from "@/types";
import type {
  SessionDetailed,
  SessionEvent,
  SessionFilter,
} from "../projects/project.type";
import type { Session } from "./project-session.type";

export const getSessions = async (params: SessionFilter) => {
  const response = await api.get<{
    data: { sessions: Session[]; pagination: Pagination };
  }>(`/analytics/projects/${params.projectId}/sessions`, { params });

  return response.data.data;
};

export const getSession = async ({
  projectId,
  sessionId,
}: {
  projectId: string;
  sessionId: string;
}) => {
  const response = await api.get<{
    data: { session: SessionDetailed; events: SessionEvent[] };
  }>(`/analytics/projects/${projectId}/sessions/${sessionId}`);

  return response.data.data;
};
