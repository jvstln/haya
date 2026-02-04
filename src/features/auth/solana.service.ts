import { api } from "@/lib/api";
import type {
  SolanaNonceResponse,
  SolanaUser,
  SolanaVerifyRequest,
  SolanaVerifyResponse,
} from "./auth.type";

/**
 * Request a nonce for wallet authentication
 */
async function requestNonce(
  walletAddress: string,
): Promise<SolanaNonceResponse> {
  const response = await api.post<SolanaNonceResponse>("/auth/nonce", {
    walletAddress,
  });
  return response.data;
}

/**
 * Verify wallet signature and receive JWT token
 */
async function verifySignature(
  payload: SolanaVerifyRequest,
): Promise<SolanaVerifyResponse> {
  const response = await api.post<SolanaVerifyResponse>(
    "/auth/verify",
    payload,
  );
  return response.data;
}

/**
 * Get authenticated user's wallet profile
 */
async function getWalletProfile(): Promise<SolanaUser> {
  const response = await api.get<SolanaUser>("/auth/profile");
  return response.data;
}

export { requestNonce, verifySignature, getWalletProfile };
