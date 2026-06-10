import { api } from "@/lib/api";
import { weekdays } from "@/lib/date.util";
import type {
  Persona,
  PersonaFilters,
  PersonasSettings,
} from "./project-persona.type";

export async function getPersonas(params: PersonaFilters) {
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
  // const response = await api.get(
  //   `/analytics/projects/${params.projectId}/persona-analysis`,
  //   { params },
  // );

  // return response.data;
}

export async function getPersonasSettings(projectId: string) {
  const response = await api.get(
    `/analytics/projects/${projectId}/persona-analysis`,
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
