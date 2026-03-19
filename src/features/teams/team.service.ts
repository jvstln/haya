import { api } from "@/lib/api";
import type {
  AssignAuditToTeam,
  NewTeam,
  Team,
  TeamFilters,
} from "./team.type";

export async function getTeams(params: TeamFilters) {
  const response = await api.get<{ data: { teams: Team[] } }>("/teams", {
    params,
  });
  return response.data.data;
}

export async function getTeam(teamId: string) {
  const response = await api.get<{ data: { team: Team } }>(`/teams/${teamId}`);
  return response.data.data.team;
}

export async function createTeam(data: NewTeam) {
  const response = await api.post("/teams", data);
  return response.data;
}

export async function inviteUserToTeam({
  teamId,
  username,
}: {
  teamId: string;
  username: string;
}) {
  const response = await api.post(`/teams/${teamId}/invite`, { username });
  return response.data;
}

export async function respondToTeamInvite({
  teamId,
  action,
}: {
  teamId: string;
  action: "accept" | "reject";
}) {
  const response = await api.post(`/teams/${teamId}/respond`, {
    accept: action === "accept",
  });
  return response.data;
}

export async function leaveTeam(teamId: string) {
  const response = await api.post(`/teams/${teamId}/leave`);
  return response.data;
}

export async function deleteMemberFromTeam({
  teamId,
  userId,
}: {
  teamId: string;
  userId: string;
}) {
  const response = await api.delete(`/teams/${teamId}/members/${userId}`);
  return response.data;
}

export async function assignAuditsToTeam(payload: AssignAuditToTeam) {
  const response = await api.post("/tasks", {
    ...payload,
    // Rewrite properties to the ones the backend understands.
    // TODO: Remove when backend updates them
    analysisIds: payload.auditIds,
    assignedToTeamId: payload.teamId,
  });
  return response.data;
}
