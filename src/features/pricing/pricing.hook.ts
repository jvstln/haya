import {
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryclient";
import { setOnboardingFormDialogView } from "../auth/components/onboarding-dialog";
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

export const useCurrentPlan = () => {
  return useQuery({
    queryKey: ["currentPlan"],
    queryFn: getCurrentPlan,
  });
};

export const useSubscribeToPlan = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const activateSubscription = useMutation({
    mutationFn: subscribeToPlan,
  });

  const subscribe = useMutation({
    mutationFn: async ({ planKey }: { planKey: string }) => {
      if (!publicKey) {
        setOnboardingFormDialogView("signUpWallet");
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
        createTransferInstruction(fromAta, toAta, publicKey, amountMicroUsdc),
      );

      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");

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
    onSuccess: (data) => {
      toast.success(data.message || "Subscribed to plan successfully", {
        id: "subscribeToPlan",
      });
      queryClient.invalidateQueries({ queryKey: ["currentPlan"] });
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
      toast.success(error.message || "Failed to cancel current plan");
    },
  });
};
