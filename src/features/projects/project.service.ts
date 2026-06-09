import { api } from "@/lib/api";
import type {
  NewProject,
  Project,
  ProjectFilters,
  ProjectOverview,
  ProjectSettings,
} from "./project.type";

export const createProject = async (payload: NewProject) => {
  const response = await api.post<{ data: { project: Project } }>(
    "/projects",
    payload,
  );

  return response.data.data.project;
};

export const getProjects = async (params: ProjectFilters) => {
  const response = await api.get<{ data: { projects: Project[] } }>(
    "/projects",
    {
      params,
    },
  );

  return response.data.data.projects;
};

export const getProject = async (id: string) => {
  const response = await api.get<{ data: { project: Project } }>(
    `/projects/${id}`,
  );

  return response.data.data.project;
};

export const getProjectOverview = async (projectId: string) => {
  const response = await api.get<{ data: ProjectOverview }>(
    `/analytics/projects/${projectId}/overview`,
  );

  return response.data.data;
};

export const updateProject = async (
  payload: ProjectSettings & { _id: string },
) => {
  const response = await api.patch(`/projects/${payload._id}`, payload);

  return response.data;
};

export const deleteProject = async (id: string) => {
  const response = await api.delete(`/projects/${id}`);

  return response.data;
};
