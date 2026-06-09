import { useQuery } from "@tanstack/react-query";
import { createQueryKeys } from "@/lib/queryclient";
import type { Persona, PersonaFilters } from "./project-persona.type";

const personaQueryKeys = createQueryKeys({
  personas: ["personas", "$filtersOrId"],
});

export function usePersona(params: PersonaFilters) {
  return useQuery({
    queryKey: personaQueryKeys.getQueryKey("personas", {
      filtersOrId: params.projectId,
    }),
    queryFn: () => {
      // Return dummy data based on the image
      const dummyPersonas: Persona[] = [
        {
          id: "1",
          projectId: params.projectId,
          sessionId: "session-1",
          name: "The Hesitant Explorer",
          avgDuration: "6m 48s",
          uniqueUsers: "2,914",
          rageClickSessions: "9.4%",
          ctaConversion: "9.4%",
          severity: "Critical",
        },
        {
          id: "2",
          projectId: params.projectId,
          sessionId: "session-2",
          name: "The Rage-Clicker",
          avgDuration: "6m 48s",
          uniqueUsers: "2,914",
          rageClickSessions: "9.4%",
          ctaConversion: "9.4%",
          severity: "Critical",
        },
        {
          id: "3",
          projectId: params.projectId,
          sessionId: "session-3",
          name: "The Ghost",
          avgDuration: "6m 48s",
          uniqueUsers: "2,914",
          rageClickSessions: "9.4%",
          ctaConversion: "9.4%",
          severity: "Critical",
        },
        {
          id: "4",
          projectId: params.projectId,
          sessionId: "session-4",
          name: "The Power Converter",
          avgDuration: "6m 48s",
          uniqueUsers: "2,914",
          rageClickSessions: "9.4%",
          ctaConversion: "9.4%",
          severity: "Critical",
        },
        {
          id: "5",
          projectId: params.projectId,
          sessionId: "session-5",
          name: "The Window Shopper",
          avgDuration: "6m 48s",
          uniqueUsers: "2,914",
          rageClickSessions: "9.4%",
          ctaConversion: "9.4%",
          severity: "Critical",
        },
      ];
      return {
        personas: dummyPersonas,
      };
    },
  });
}
