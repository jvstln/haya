import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./user.service";
import type { UserFilters } from "./user.type";

export function useUsers(params: UserFilters = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
}
