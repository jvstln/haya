import type { QueryParams } from "@/types";

export type UserFilters = QueryParams;

export type User = {
  _id: string;
  username: string;
};
