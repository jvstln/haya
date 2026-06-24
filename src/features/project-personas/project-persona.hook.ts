import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { stringToHashedNumber } from "@/lib/utils";
import {
  getPersona,
  getPersonas,
  updatePersonasSettings,
} from "./project-persona.service";
import type { Persona, PersonaFilters } from "./project-persona.type";

export function usePersonas(params: PersonaFilters) {
  return useQuery({
    queryKey: ["personas", params.projectId],
    queryFn: () => getPersonas(params),
    // TODO: Remove once _id propagates through all persona
    select(data) {
      return {
        ...data,
        analysis: data.analysis
          ? {
              ...data.analysis,
              personas: data.analysis.personas.map((persona) => ({
                ...persona,
                _id: persona._id || String(stringToHashedNumber(persona.name)),
              })),
            }
          : null,
      };
    },
  });
}

export function usePersona(params: { projectId: string; personaId: string }) {
  const personasQuery = usePersonas({ projectId: params.projectId });

  return useQuery<Persona>({
    queryKey: ["personas", params.projectId, params.personaId],
    queryFn: async () => {
      try {
        const persona = await getPersona(params);
        return persona;
      } catch (error) {
        // TODO: Remove once _id propagates through all persona

        if (isAxiosError(error) && error.status === 404) {
          const persona = personasQuery.data?.analysis?.personas.find(
            (persona) => persona._id === params.personaId,
          );
          if (!persona) throw error;
          return persona;
        }

        throw error;
      }
    },
    enabled: !personasQuery.isPending && !personasQuery.isError,
  });
}

export function useUpdatePersonasSettings() {
  return useMutation({
    mutationFn: updatePersonasSettings,
  });
}
