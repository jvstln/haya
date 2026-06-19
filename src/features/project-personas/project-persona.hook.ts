import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getPersonas,
  getPersonasSettings,
  updatePersonasSettings,
} from "./project-persona.service";
import type { PersonaFilters } from "./project-persona.type";

export function usePersonas(params: PersonaFilters) {
  return useQuery({
    queryKey: ["personas", params.projectId],
    queryFn: () => getPersonas(params),
  });
}

export function usePersonasSettings(projectId: string) {
  return useQuery({
    queryKey: ["personas", projectId],
    queryFn: () => getPersonasSettings(projectId),
  });
}

export function useUpdatePersonasSettings() {
  return useMutation({
    mutationFn: updatePersonasSettings,
  });
}
