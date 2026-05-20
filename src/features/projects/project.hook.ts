import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { createQueryKeys } from "@/lib/queryclient";
import * as ProjectService from "./project.service";
import type { ProjectFilters, SessionFilter } from "./project.type";

export const projectQueryKeys = createQueryKeys({
  list: ["projects", "$filters"],
  detail: ["projects", "$id"],
  overview: ["projects", "$projectId", "overview"],
  sessions: ["projects", "$projectId", "sessions", "$filters"],
  session: ["projects", "$projectId", "sessions", "$sessionId"],
});

export const useProjects = (filters: ProjectFilters = {}) => {
  return useQuery({
    queryKey: projectQueryKeys.getQueryKey("list", { filters }),
    queryFn: () => ProjectService.getProjects(filters),
  });
};

export const useProjectSessions = (
  projectId: string,
  filters: Omit<SessionFilter, "projectId"> = {},
) => {
  return useQuery({
    queryKey: projectQueryKeys.getQueryKey("sessions", { projectId, filters }),
    queryFn: () => ProjectService.getSessions({ projectId, ...filters }),
    enabled: !!projectId,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: projectQueryKeys.getQueryKey("detail", { id }),
    queryFn: () => ProjectService.getProject(id),
    enabled: !!id,
  });
};

export const useProjectOverview = (projectId: string) => {
  return useQuery({
    queryKey: projectQueryKeys.getQueryKey("overview", { projectId }),
    queryFn: () => ProjectService.getProjectOverview(projectId),
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

export const useCreateProject = () => {
  return useMutation({
    mutationFn: ProjectService.createProject,
    onSuccess: () => {
      toast.success("Project created successfully");
      projectQueryKeys.invalidatePrefix("detail");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create project");
    },
  });
};

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: ProjectService.updateProject,
    onSuccess: (_data, variables) => {
      toast.success("Project updated successfully");
      projectQueryKeys.invalidateQueries("detail", { id: variables._id });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update project");
    },
  });
};

export const useDeleteProject = () => {
  return useMutation({
    mutationFn: ProjectService.deleteProject,
    onSuccess: (_data, id) => {
      toast.success("Project deleted successfully");
      projectQueryKeys.invalidateQueries("detail", { id });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete project");
    },
  });
};
