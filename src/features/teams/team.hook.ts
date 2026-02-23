import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { invalidateNotificationQueries } from "@/features/notifications/notification.hook";
import { queryClient } from "@/lib/queryclient";
import {
  createTeam,
  getTeam,
  getTeams,
  inviteUserToTeam,
  respondToTeamInvite,
} from "./team.service";
import type { TeamFilters } from "./team.type";

export function useTeams(filters: TeamFilters = {}) {
  return useQuery({
    queryKey: ["teams", filters],
    queryFn: async () => getTeams(filters),
  });
}

export function useTeam(teamId = "") {
  return useQuery({
    queryKey: ["teams", teamId],
    queryFn: async () => getTeam(teamId),
    enabled: !!teamId,
  });
}

export function useCreateTeam() {
  return useMutation({
    mutationFn: createTeam,
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
    mutationFn: inviteUserToTeam,
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
    mutationFn: respondToTeamInvite,
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
