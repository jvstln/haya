"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { InvitationCodePrompt } from "@/features/auth/components/invitation-code-prompt";
import { OnboardingFormDialog } from "@/features/auth/components/onboarding-dialog";
import { SolanaProvider } from "@/features/auth/components/solana-provider";
import { ChangeUsernameDialogGuard } from "@/features/users/components/change-username-dialog";
import { queryClient } from "@/lib/queryclient";
import { Toaster } from "@workspace/ui/components/sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SolanaProvider>
        {children}
        <Toaster position="top-center" richColors />
        <OnboardingFormDialog />
        <ChangeUsernameDialogGuard />
        <InvitationCodePrompt />
      </SolanaProvider>
    </QueryClientProvider>
  );
};
