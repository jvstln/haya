import { useQuery } from "@tanstack/react-query";
import { projectQueryKeys } from "../projects/project.hook";
import type { SessionFilter } from "../projects/project.type";
import * as projectSessionService from "./project-session.service";

export const useSessions = (
  projectId: string,
  filters: Omit<SessionFilter, "projectId"> = {},
) => {
  return useQuery({
    queryKey: projectQueryKeys.getQueryKey("sessions", { projectId, filters }),
    queryFn: () => projectSessionService.getSessions({ projectId, ...filters }),
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
    queryFn: () => projectSessionService.getSession({ projectId, sessionId }),
    enabled: !!projectId && !!sessionId,
  });
};
