import type z from "zod";
import type {
  forgotPasswordSchema,
  loginSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signUpEmailSchema,
  verifyOtpSchema,
} from "./auth.schema";

export type SignUpEmail = z.infer<typeof signUpEmailSchema>;
export type SignUpEmailInput = z.input<typeof signUpEmailSchema>;
export type VerifyOtp = z.infer<typeof verifyOtpSchema>;
export type ResendVerification = z.infer<typeof resendVerificationSchema>;
export type LoginEmail = z.infer<typeof loginSchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>; // Solana authentication types

export interface SolanaNonceResponse {
  message: string;
  nonce: string;
}

export interface SolanaVerifyRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface SolanaVerifyResponse {
  token: string;
  user: SolanaUser;
}

export interface SolanaUser {
  walletAddress: string;
  lastLogin: string;
  createdAt?: string;
}
