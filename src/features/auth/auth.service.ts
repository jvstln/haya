import Cookies from "js-cookie";
import { api } from "@/lib/api";
import type {
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
export async function getAccessToken(): Promise<string | null> {
  try {
    let token: string | undefined;

    if (typeof window === "undefined") {
      // Server-side: use next/headers
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      token = cookieStore.get("haya.accessToken")?.value;
    } else {
      // Client-side: use js-cookie
      token = Cookies.get("haya.accessToken");
    }

    if (!token) return null;

    return token;
  } catch {
    return null;
  }
}

export {
  signUpEmail,
  login,
  logout,
  verifyOtp,
  resendVerification,
  forgotPassword,
  resetPassword,
};
