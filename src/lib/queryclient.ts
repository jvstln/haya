"use client";

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/react-query").QueryClient;
  }
}

// This code is for all users
if (window !== undefined) {
  window.__TANSTACK_QUERY_CLIENT__ = queryClient;
}
