import Cookies from "js-cookie";
import { api } from "@/lib/api";
import type {
  AuthState,
  ForgotPassword,
  LoginEmail,
  ResendVerification,
  ResetPassword,
  SignUpEmail,
  VerifyOtp,
} from "./auth.type";

async function signUpEmail(payload: SignUpEmail) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

async function login(payload: LoginEmail) {
  const response = await api.post("/auth/login", payload);
  return response.data;
}

function redirectToGoogleAuth() {
  const baseUrl = api.defaults.baseURL || window.location.host;
  window.location.href = baseUrl.replace(/\/*$/, "/auth/google");
}

async function exchangeGoogleAuthCodeForToken(code: string) {
  const response = await api.post("/auth/google/exchange-code", { code });
  return response.data;
}

async function logout() {
  const response = await api.post("/auth/logout");
  return response.data;
}

async function verifyOtp(payload: VerifyOtp) {
  const response = await api.get(`/auth/verify-email/${payload.code}`);
  return response.data;
}

async function resendVerification(payload: ResendVerification) {
  const response = await api.post("/auth/resend-verification", payload);
  return response.data;
}

async function forgotPassword(payload: ForgotPassword) {
  const response = await api.post("/auth/forgot-password", payload);
  return response.data;
}

async function resetPassword(payload: ResetPassword) {
  const response = await api.post("/auth/reset-password", {
    ...payload,
    token: payload.code,
  });
  return response.data;
}

/** Read access token from cookie - works on both client and server */
export async function getAuth(): Promise<AuthState | null> {
  try {
    let authString: string | undefined;

    if (typeof window === "undefined") {
      // Server-side: use next/headers
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      authString = cookieStore.get("haya.auth")?.value;
    } else {
      // Client-side: use js-cookie
      authString = Cookies.get("haya.auth");
    }

    const auth: AuthState = JSON.parse(authString || "{}").state;

    if (!auth) return null;

    return auth;
  } catch {
    return null;
  }
}

export {
  signUpEmail,
  login,
  redirectToGoogleAuth,
  exchangeGoogleAuthCodeForToken,
  logout,
  verifyOtp,
  resendVerification,
  forgotPassword,
  resetPassword,
};
