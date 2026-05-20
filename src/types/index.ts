import type { AppRoutes, LayoutRoutes } from "../../.next/types/routes";

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type QueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  from?: Date;
  to?: Date;
};

export type EventReturnType =
  | undefined
  | boolean
  | Promise<boolean | undefined>
  | Promise<void>;

export type RouteWithParams = AppRoutes;

export type Params<T extends RouteWithParams> = Awaited<PageProps<T>["params"]>;
