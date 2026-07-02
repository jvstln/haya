import { api } from "@/lib/api";
import type {
  ForgotPassword,
  LoginEmail,
  ResendVerification,
  ResetPassword,
  SignUpEmail,
  VerifyOtp,
} from "./auth.type";
import { getAuth } from "./auth-cookie";
import { getInvitationCode } from "./components/invitation-code-prompt";

async function signUpEmail(payload: SignUpEmail) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

async function login(payload: LoginEmail) {
  const response = await api.post("/auth/login", payload);
  return response.data;
}

async function redirectToGoogleAuth() {
  const baseUrl = api.defaults.baseURL || window.location.host;
  // Temporary: Intercept auth endpoints that require invitation code and prompt user to enter one
  const { code } = await getInvitationCode();
  if (!code) return;

  window.location.href = `${baseUrl.replace(/\/*$/, "/auth/google")}?invitationCode=${code}`;
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

// Imported from ./auth-cookie

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
  getAuth,
};
