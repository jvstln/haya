import axios from "axios";
import { getAuth } from "@/features/auth/auth.service";
import { getInvitationCode } from "@/features/auth/components/invitation-code-prompt";

export const api = axios.create({
  baseURL: "https://api.usehaya.io/api/v1",
});

// TODO: Remove when backend updates properties
// Temporary: Rewrite payload properties starting with audit to analysis until backend updates them.
// Audit is a new name for what the backend calls analysis.
api.interceptors.request.use(async (config) => {
  for (const key in config.data || {}) {
    if (key.startsWith("audit")) {
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

export const getErrorMessage = (error: unknown, fallback?: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
