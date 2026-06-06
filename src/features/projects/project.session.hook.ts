import { useQuery } from "@tanstack/react-query";
import z from "zod";
import { api } from "@/lib/api";
import { projectQueryKeys } from "./project.hook";
import * as ProjectService from "./project.service";
import type { SessionFilter } from "./project.type";

export const useSessions = (
  projectId: string,
  filters: Omit<SessionFilter, "projectId"> = {},
) => {
  return useQuery({
    queryKey: projectQueryKeys.getQueryKey("sessions", { projectId, filters }),
    queryFn: () => ProjectService.getSessions({ projectId, ...filters }),
    enabled: !!projectId,
  });
};

export const useSession = ({
  projectId,
  sessionId,
}: {
  projectId: string;
  sessionId: string;
}) => {
  return useQuery({
    queryKey: projectQueryKeys.getQueryKey("session", { projectId, sessionId }),
    queryFn: () => ProjectService.getSession({ projectId, sessionId }),
    enabled: !!projectId && !!sessionId,
  });
};

export const useSessionReplayEvents = (replayUrl?: string | null) => {
  return useQuery({
    queryKey: ["session-replay-events", replayUrl],
    queryFn: async () => {
      if (!replayUrl) return;

      const response = await api.get<string>(replayUrl, {
        headers: { "Content-Type": "application/json" },
      });

      // Events is multiple JSON string separated with new lines (NDJSON)
      const parsedEvents = response.data
        .split(/\n/)
        .filter(Boolean)
        .map((ev) => JSON.parse(ev));

      const eventsSchema = z.array(z.any());

      return eventsSchema.parse(parsedEvents);
    },
    enabled: !!replayUrl,
  });
};
