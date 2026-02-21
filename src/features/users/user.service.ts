import { api } from "@/lib/api";
import type { User, UserFilters } from "./user.type";

async function getUsers(params: UserFilters) {
  const response = await api.get<{ data: { users: User[] } }>(
    "/teams/users/search",
    {
      params: { ...params, q: params.search },
    },
  );
  return response.data.data;
}

export { getUsers };
