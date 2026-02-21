import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import type { QueryParams } from "@/types/type";

export function useFilters<T extends QueryParams>(initialState: T = {} as any) {
  const [filters, setFilters] = useState<T & QueryParams>({
    search: "",
    limit: 10,
    page: 1,
    ...initialState,
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  return {
    filters: { ...filters, search: debouncedSearch },
    originalFilters: { ...filters },
    setFilters,
    mergeFilters: (newFilters: T) => {
      setFilters((f) => ({ ...f, ...newFilters }));
    },
    resetFilters: () => {
      setFilters({ search: "", limit: 10, page: 1, ...initialState });
    },
  };
}
