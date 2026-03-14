import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { invalidateNotificationQueries } from "@/features/notifications/notification.hook";
import { queryClient } from "@/lib/queryclient";
import * as TeamService from "./team.service";
import type { TeamFilters } from "./team.type";

export function useTeams(filters: TeamFilters = {}) {
  return useQuery({
    queryKey: ["teams", filters],
    queryFn: async () => TeamService.getTeams(filters),
  });
}

export function useTeam(teamId = "") {
  return useQuery({
    queryKey: ["teams", teamId],
    queryFn: async () => TeamService.getTeam(teamId),
    enabled: !!teamId,
  });
}

export function useCreateTeam() {
  return useMutation({
    mutationFn: TeamService.createTeam,
    onSuccess: () => {
      toast.success("Team created successfully");
      invalidateTeamQueries();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create team");
    },
  });
}

export function invalidateTeamQueries() {
  ["teams"].map((key) =>
    queryClient.invalidateQueries({
      queryKey: [key],
    }),
  );
}

export function useInviteUserToTeam() {
  return useMutation({
    mutationFn: TeamService.inviteUserToTeam,
    onSuccess: () => {
      toast.success("User invited successfully");
      invalidateTeamQueries();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to invite user");
    },
  });
}

export function useRespondToTeamInvite() {
  return useMutation({
    mutationFn: TeamService.respondToTeamInvite,
    onSuccess: (_data, variables) => {
      const action = variables.action === "accept" ? "accepted" : "declined";
      toast.success(_data.message || `Team invite ${action}`);
      invalidateTeamQueries();
      invalidateNotificationQueries();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to respond to invite");
    },
  });
}

export function useAssignAuditsToTeam() {
  return useMutation({
    mutationFn: TeamService.assignAuditsToTeam,
    onSuccess: () => {
      toast.success("Audits assigned successfully");
      invalidateTeamQueries();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign audits");
    },
  });
}
