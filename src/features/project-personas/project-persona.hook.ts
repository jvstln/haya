import { useMutation, useQuery } from "@tanstack/react-query";
import { createQueryKeys } from "@/lib/queryclient";
import {
  getPersonas,
  getPersonasSettings,
  updatePersonasSettings,
} from "./project-persona.service";
import type { PersonaFilters } from "./project-persona.type";

const personaQueryKeys = createQueryKeys({
  personas: ["personas", "$filtersOrId"],
});

export function usePersonas(params: PersonaFilters) {
  return useQuery({
    queryKey: personaQueryKeys.getQueryKey("personas", {
      filtersOrId: params.projectId,
    }),
    queryFn: () => getPersonas(params),
  });
}

export function usePersonasSettings(projectId: string) {
  return useQuery({
    queryKey: personaQueryKeys.getQueryKey("personas", {
      filtersOrId: projectId,
    }),
    queryFn: () => getPersonasSettings(projectId),
  });
}

export function useUpdatePersonasSettings() {
  return useMutation({
    mutationFn: updatePersonasSettings,
  });
}
