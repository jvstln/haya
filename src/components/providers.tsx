"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { OnboardingFormDialog } from "@/features/auth/components/onboarding-dialog";
import { SolanaProvider } from "@/features/auth/components/solana-provider";
import { queryClient } from "@/lib/queryclient";
import { Toaster } from "./ui/sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SolanaProvider>
        {children}
        <Toaster position="top-center" richColors />
        <OnboardingFormDialog />
      </SolanaProvider>
    </QueryClientProvider>
  );
};
