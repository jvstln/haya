import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/auth.store";
import { getUsers, updateUsername } from "./user.service";
import type { UserFilters } from "./user.type";

export function useUsers(params: UserFilters = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
}

export function useUpdateUsername() {
  return useMutation({
    mutationFn: updateUsername,
    onMutate: () => {
      toast.loading("Updating username...", {
        id: "updateUsername",
      });
    },
    onSuccess(data, variables) {
      toast.success(data.message || "Username updated successfully", { id: "updateUsername" });
      const authState = useAuthStore.getState();
      if (authState.user) {
        authState.setAuth({
          ...authState,
          user: {
            ...authState.user,
            username: variables.username,
          },
        });
      }
    },
    onError(error) {
      toast.error(`Error: ${error.message}`, {
        id: "updateUsername",
      });
    },
  });
}
