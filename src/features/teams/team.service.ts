import { api } from "@/lib/api";
import type { NewTeam, Team, TeamFilters } from "./team.type";

async function getTeams(params: TeamFilters) {
  const response = await api.get<{ data: { teams: Team[] } }>("/teams", {
    params,
  });
  return response.data.data;
}

async function getTeam(teamId: string) {
  const response = await api.get(`/teams/${teamId}`);
  return response.data;
}

async function createTeam(data: NewTeam) {
  const response = await api.post("/teams", data);
  return response.data;
}

async function inviteUserToTeam({
  teamId,
  username,
}: {
  teamId: string;
  username: string;
}) {
  const response = await api.post(`/teams/${teamId}/invite`, { username });
  return response.data;
}

async function respondToTeamInvite({
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

async function leaveTeam(teamId: string) {
  const response = await api.post(`/teams/${teamId}/leave`);
  return response.data;
}

async function deleteMemberFromTeam({
  teamId,
  userId,
}: {
  teamId: string;
  userId: string;
}) {
  const response = await api.delete(`/teams/${teamId}/members/${userId}`);
  return response.data;
}

export {
  getTeams,
  getTeam,
  createTeam,
  inviteUserToTeam,
  respondToTeamInvite,
  leaveTeam,
  deleteMemberFromTeam,
};
