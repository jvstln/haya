import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

// This code below is for tanstack devtools

declare namespace globalThis {
  let __TANSTACK_QUERY_CLIENT__: typeof queryClient;
}

globalThis.__TANSTACK_QUERY_CLIENT__ = queryClient;

/*  ---- Utils ------------------------------------------------

/**
 * @description Extract param from query key. A param is a placeholder that will be specified when getting query keys
 * @example
 * type Param = GetParam<"$id">; // "id"
 */
type GetParam<T extends string> = T extends `$${infer P}` ? P : never;

/** Replace params placeholders ($param) with their actual value
 * If param doesnt exist, null gets substituted
 */
const hydrateKey = (key: string[], params: Record<string, unknown>) => {
  return key.map((key) => {
    if (key.startsWith("$") && key in params) {
      return params[key] ?? null;
    }
    return key;
  });
};

export const createQueryKeys = <const T extends Record<string, string[]>>(
  queryKeyConfig: T,
) => {
  const getQueryKey = <K extends keyof T>(
    key: K,
    ...args: GetParam<T[K][number]> extends never
      ? []
      : [Record<GetParam<T[K][number]>, unknown>]
  ) => {
    return hydrateKey(queryKeyConfig[key], args[0] ?? {});
  };

  const invalidateQueries = <K extends keyof T>(
    key: K,
    ...args: GetParam<T[K][number]> extends never
      ? []
      : [Record<GetParam<T[K][number]>, unknown>]
  ) => {
    const queryKey = getQueryKey(key, ...args);
    queryClient.invalidateQueries({ queryKey });
  };

  const invalidatePrefix = <K extends keyof T>(key: K) => {
    const firstParamIndex = queryKeyConfig[key].findIndex((k) =>
      k.startsWith("$"),
    );
    const queryKey =
      firstParamIndex === -1
        ? queryKeyConfig[key]
        : queryKeyConfig[key].slice(0, firstParamIndex);
    queryClient.invalidateQueries({ queryKey });
  };

  return { queryKeyConfig, getQueryKey, invalidateQueries, invalidatePrefix };
};
