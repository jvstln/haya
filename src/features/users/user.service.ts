import { api } from "@/lib/api";
import type { AuthUser, SolanaUser } from "../auth/auth.type";
import type { User, UserFilters } from "./user.type";

export async function getUsers(params: UserFilters) {
  const response = await api.get<{ data: { users: User[] } }>(
    "/teams/users/search",
    {
      params: { ...params, q: params.search },
    },
  );
  return response.data.data;
}

export async function updateUsername(payload: { username: string }) {
  const response = await api.patch("/auth/profile/username", payload);
  return response.data;
}

export async function getCurrentUserProfile() {
  const response = await api.get<AuthUser | SolanaUser>("/auth/profile");
  return response.data;
}
