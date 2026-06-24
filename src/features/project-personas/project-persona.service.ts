import { api } from "@/lib/api";
import { weekdays } from "@/lib/date.util";
import type {
  PersonaAnalysisData,
  PersonaFilters,
  PersonasSettings,
} from "./project-persona.type";

export async function getPersonas(params: PersonaFilters) {
  const response = await api.get<{ data: PersonaAnalysisData }>(
    `/analytics/projects/${params.projectId}/persona-analysis`,
    { params },
  );

  return response.data.data;
}

export async function getPersona(params: {
  projectId: string;
  personaId: string;
}) {
  const response = await api.get(
    `/analytics/projects/${params.projectId}/personas/${params.personaId}`,
  );

  return response.data;
}

export async function updatePersonasSettings(settings: PersonasSettings) {
  if (settings.schedule.type === "manual") {
    return api.post(
      `/analytics/projects/${settings.projectId}/persona-analysis/generate`,
    );
  }

  const response = await api.patch(
    `/analytics/projects/${settings.projectId}/persona-analysis/schedule`,
    {
      mode: "automatic",
      dayOfWeek: weekdays.findIndex(
        (day) =>
          "weekday" in settings.schedule &&
          day.weekday === settings.schedule.weekday,
      ),
      enabled: true,
    },
  );

  return response.data;
}
