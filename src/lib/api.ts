import axios from "axios";
import { toast } from "sonner";
import { getAuth } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";
import { getInvitationCode } from "@/features/auth/components/invitation-code-prompt";
import { setOnboardingFormDialogView } from "@/features/auth/components/onboarding-dialog";

export const api = axios.create({
  baseURL: "https://api.usehaya.io/api/v1",
});

// TODO: Remove when backend updates properties
// Temporary: Rewrite payload properties starting with audit to analysis until backend updates them.
// Audit is a new name for what the backend calls analysis.
api.interceptors.request.use(async (config) => {
  for (const key in config.data || {}) {
    if (key.startsWith("audit") && key !== "audit_type") {
      const rewrittenProperty = key.replace(/^audit/, "analysis");
      config.data[rewrittenProperty] = config.data[key];
      delete config.data[key];
    }
  }

  for (const key in config.params || {}) {
    if (key.startsWith("audit")) {
      const rewrittenProperty = key.replace(/^audit/, "analysis");
      config.params[rewrittenProperty] = config.params[key];
      delete config.params[key];
    }
  }

  if (config.data instanceof FormData) {
    for (const [key, value] of config.data.entries()) {
      if (key.startsWith("audit")) {
        const rewrittenProperty = key.replace(/^audit/, "analysis");
        config.data.set(rewrittenProperty, value);
        config.data.delete(key);
      }
    }
  }

  return config;
});

// Temporary: Intercept auth endpoints that require invitation code and prompt user to enter one
api.interceptors.request.use(async (config) => {
  const requiredEndpoints = ["/auth/register", "/auth/login", "/auth/verify"];

  if (requiredEndpoints.some((path) => config.url?.endsWith(path))) {
    const { code } = await getInvitationCode();
    config.data.invitationCode = code;
  }

  return config;
});

// Attach JWT token to all requests
api.interceptors.request.use(async (config) => {
  const auth = await getAuth();
  const accessToken = auth?.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Format error messages properly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    throw {
      ...error,
      originalMessage: error.message,
      message: getErrorMessage(error),
    };
  },
);

// Log user out if token has expired and prompt for login
api.interceptors.response.use(null, async (error) => {
  if (
    error.response?.status === 401 &&
    error.message?.toLowerCase().includes("token") &&
    useAuthStore.getState().accessToken
  ) {
    useAuthStore.getState().resetAuth();
    toast.error("Session expired. Please log in again.");
    setOnboardingFormDialogView("login");
  }

  return Promise.reject(error);
});

export const getErrorMessage = (error: unknown, fallback?: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
