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

export {
  signUpEmail,
  login,
  logout,
  verifyOtp,
  resendVerification,
  forgotPassword,
  resetPassword,
};
