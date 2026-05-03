import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { queryClient } from "@/lib/queryclient";
import { useAuth } from "../auth/auth.hook";
import {
  getCurrentUserProfile,
  getUsers,
  updateUsername,
} from "./user.service";
import type { UserFilters } from "./user.type";

export function useUsers(params: UserFilters = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
}

export function useUpdateUsername() {
  const auth = useAuth();

  return useMutation({
    mutationFn: updateUsername,
    onMutate: () => {
      toast.loading("Updating username...", {
        id: "updateUsername",
      });
    },
    onSuccess(data) {
      toast.success(data.message || "Username updated successfully", {
        id: "updateUsername",
      });
      queryClient.invalidateQueries({
        queryKey: ["current-user-profile"],
      });
      auth.refreshAuth();
    },
    onError(error) {
      toast.error(`Error: ${error.message}`, {
        id: "updateUsername",
      });
    },
  });
}

export const useCurrentUserProfile = () => {
  return useQuery({
    queryKey: ["current-user-profile"],
    queryFn: getCurrentUserProfile,
  });
};
