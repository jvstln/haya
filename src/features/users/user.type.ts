import type { QueryParams } from "@/types/type";

export type UserFilters = QueryParams;

export type User = {
  _id: string;
  username: string;
};
