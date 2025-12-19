import axios from "axios";
import { getAccessToken } from "@/features/auth/auth.service";

export const api = axios.create({
  baseURL: "https://api.usehaya.io/api/v1",
});

// Attach JWT token to all requests
api.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    throw {
      ...error,
      originalMessage: error.message,
      message: getErrorMessage(error),
    };
  }
);

export const getErrorMessage = (error: unknown, fallback?: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
