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

  return [
    { ...filters, originalSearch: filters.search, search: debouncedSearch },
    setFilters,
  ] as const;
}
