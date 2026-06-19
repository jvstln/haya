import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryclient";
import * as ProjectService from "./project.service";
import type { ProjectFilters } from "./project.type";

export const useProjects = (filters: ProjectFilters = {}) => {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: () => ProjectService.getProjects(filters),
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => ProjectService.getProject(id),
    enabled: !!id,
  });
};

export const useProjectOverview = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId, "overview"],
    queryFn: () => ProjectService.getProjectOverview(projectId),
    enabled: !!projectId,
  });
};

export const useCreateProject = () => {
  return useMutation({
    mutationFn: ProjectService.createProject,
    onSuccess: () => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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
      queryClient.invalidateQueries({ queryKey: ["projects", variables._id] });
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
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete project");
    },
  });
};
