import { queryClient } from "@/lib/queryclient";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "./ui/sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
};
