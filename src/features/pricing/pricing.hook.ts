import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryclient";
import { triggerPlanSuccess } from "./components/billing-success-dialog";
import {
  cancelPlan,
  getCurrentPlan,
  getPlanDetails,
  getPlans,
  subscribeToPlan,
} from "./pricing.service";

export const usePlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });
};

export const useCurrentPlan = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["currentPlan"],
    queryFn: getCurrentPlan,
    enabled: options?.enabled,
  });
};

export const useSubscribeToPlan = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { setVisible: setWalletModalVisible } = useWalletModal();
  const activateSubscription = useMutation({
    mutationFn: subscribeToPlan,
  });

  const subscribe = useMutation({
    mutationFn: async ({ planKey }: { planKey: string }) => {
      if (!publicKey) {
        // Just connect a wallet for signing — never re-authenticate. The
        // user is already logged in (email/password or Google); routing
        // through the wallet *sign-in* flow here would silently swap their
        // session to whatever account that wallet resolves to on the
        // backend, which may not even be this account. Wallet-based login
        // is still available separately for users who want it as their
        // primary auth method — this is just the bare connect modal.
        setWalletModalVisible(true);
        throw new Error("Connect wallet first");
      }

      const plan = await queryClient.fetchQuery({
        queryKey: ["planDetails", { planKey }],
        queryFn: () => getPlanDetails({ planKey }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      const usdcMint = new PublicKey(plan.usdcMintAddress);
      const receivingWallet = new PublicKey(plan.receivingAddress);

      const fromAta = await getAssociatedTokenAddress(usdcMint, publicKey);
      const toAta = await getAssociatedTokenAddress(usdcMint, receivingWallet);

      const amountMicroUsdc = Math.round(plan.totalPriceUsd * 1_000_000); // USDC has 6 decimals

      const tx = new Transaction().add(
        // Idempotent: only creates the receiving wallet's USDC token account
        // if it doesn't exist yet. Skipping this fails the transfer below if
        // the receiving wallet has never held this mint before.
        createAssociatedTokenAccountIdempotentInstruction(
          publicKey,
          toAta,
          receivingWallet,
          usdcMint,
        ),
        // "Checked" variant guards against a stale/wrong decimals assumption
        // silently moving the wrong amount.
        createTransferCheckedInstruction(
          fromAta,
          usdcMint,
          toAta,
          publicKey,
          amountMicroUsdc,
          6,
        ),
      );

      const signature = await sendTransaction(tx, connection);

      const response = await activateSubscription.mutateAsync({
        paymentSignature: signature,
        planKey: plan.planKey,
        billingInterval: plan.billingInterval,
      });

      return response;
      // return plan;
    },
    onMutate() {
      toast.loading("Subscribing to plan...", { id: "subscribeToPlan" });
    },
    onSuccess: (data, variables) => {
      toast.success(data.message || "Subscribed to plan successfully", {
        id: "subscribeToPlan",
      });
      queryClient.invalidateQueries({ queryKey: ["currentPlan"] });
      triggerPlanSuccess(variables.planKey);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to subscribe to plan", {
        id: "subscribeToPlan",
      });
    },
  });

  return subscribe;
};

export const useCancelPlan = () => {
  return useMutation({
    mutationFn: cancelPlan,
    onSuccess: (data) => {
      toast.success(data.message || "Current plan cancelled successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to cancel current plan");
    },
  });
};
