import { api } from "@/lib/api";
import type { TelegramLinkResponse, TelegramStatus } from "./telegram.type";

export const linkTelegram = async () => {
  const response = await api.post<{ data: TelegramLinkResponse }>(
    "/telegram/link",
  );
  return response.data.data;
};

export const getTelegramStatus = async () => {
  const response = await api.get<{ data: TelegramStatus }>("/telegram/status");
  return response.data.data;
};

export const unlinkTelegram = async () => {
  const response = await api.delete("/telegram/unlink");
  return response.data;
};
