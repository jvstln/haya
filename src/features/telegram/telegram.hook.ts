import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryclient";
import {
  getTelegramStatus,
  linkTelegram,
  unlinkTelegram,
} from "./telegram.service";

export const useTelegramStatus = (options?: { refetchInterval?: number }) => {
  return useQuery({
    queryKey: ["telegramStatus"],
    queryFn: getTelegramStatus,
    refetchInterval: options?.refetchInterval,
  });
};

export const useLinkTelegram = () => {
  return useMutation({
    mutationFn: linkTelegram,
    onError: (error) => {
      // 402 (quota exceeded) is surfaced by the global upgrade modal
      if (
        (error as { response?: { status?: number } })?.response?.status === 402
      ) {
        return;
      }
      toast.error(error.message || "Failed to connect Telegram");
    },
  });
};

export const useUnlinkTelegram = () => {
  return useMutation({
    mutationFn: unlinkTelegram,
    onSuccess: () => {
      toast.success("Telegram disconnected");
      queryClient.invalidateQueries({ queryKey: ["telegramStatus"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to disconnect Telegram");
    },
  });
};
