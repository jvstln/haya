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
