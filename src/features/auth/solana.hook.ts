import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useMutation } from "@tanstack/react-query";
import bs58 from "bs58";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "./auth.store";
import { setOnboardingFormDialogView } from "./components/onboarding-dialog";
import * as SolanaService from "./solana.service";

/**
 * Hook for requesting a nonce from the backend
 */
function useRequestNonce() {
  return useMutation({
    mutationFn: SolanaService.requestNonce,
    onError(error) {
      toast.error(`Error: ${error.message}`);
    },
  });
}

/**
 * Hook for verifying wallet signature and getting JWT
 */
function useVerifyWalletSignature() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: SolanaService.verifySignature,
    onSuccess(data) {
      // Store JWT token and user in auth store
      setAuth({
        accessToken: data.token,
        refreshToken: null,
        user: {
          id: data.user.walletAddress,
          email: "",
          authMethod: "solana",
          lastLogin: data.user.lastLogin,
          walletAddress: data.user.walletAddress,
        },
      });
      // Close the onboarding dialog
      setOnboardingFormDialogView(null);
      toast.success("Wallet authentication successful!");
    },
    onError(error) {
      toast.error(`Error: ${error.message}`);
    },
  });
}

/**
 * Core hook for complete Solana wallet authentication flow
 * Handles: connect → request nonce → sign message → verify → store JWT
 */
function useSolanaAuth() {
  const { setVisible: setModalVisibility, visible: isModalVisible } =
    useWalletModal();
  const {
    publicKey,
    signMessage,
    connected,
    disconnect,
    disconnecting,
    connecting,
  } = useWallet();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const requestNonceMutation = useRequestNonce();
  const verifySignatureMutation = useVerifyWalletSignature();

  const walletAddress = publicKey?.toBase58() ?? null;

  const authenticate = async () => {
    if (!publicKey || !signMessage) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsAuthenticating(true);
    const loadingToastId = toast.loading("Authenticating with wallet...");

    try {
      // Step 1: Request nonce
      const { message } = await requestNonceMutation.mutateAsync(
        publicKey.toBase58()
      );

      // Step 2: Sign message with wallet
      const encodedMessage = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(encodedMessage);
      const signature = bs58.encode(signatureBytes);

      // Step 3: Verify signature and get JWT
      await verifySignatureMutation.mutateAsync({
        walletAddress: publicKey.toBase58(),
        signature,
        message,
      });

      toast.dismiss(loadingToastId);
    } catch (error) {
      toast.dismiss(loadingToastId);
      console.error("Wallet authentication failed:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    // Modal state
    isModalVisible,
    setModalVisibility,

    // Wallet state
    connected,
    walletAddress,
    publicKey,

    // Actions
    disconnect,
    authenticate,

    // Loading states
    isAuthenticating,
    isConnecting: connecting,
    isDisconnecting: disconnecting,
  };
}

export { useSolanaAuth, useRequestNonce, useVerifyWalletSignature };
