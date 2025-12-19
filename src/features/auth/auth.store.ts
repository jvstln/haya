import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  authMethod: string;
  lastLogin: string;
  walletAddress?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

interface AuthActions {
  setAuth: (authState: AuthState) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAuth: (authState: AuthState) => {
        set(authState);
        // Set token in cookie for serverside functions
        Cookies.set("haya.accessToken", authState.accessToken ?? "", {
          expires: authState.accessToken ? 7 : 0,
          sameSite: "lax",
        });
      },
      resetAuth: () => {
        set({ accessToken: null, refreshToken: null, user: null });
        // Disconnect wallet if connected
        if (window.solana?.disconnect) {
          window.solana.disconnect();
        }
        // Remove token from cookie
        Cookies.remove("haya.accessToken");
      },
    }),
    {
      name: "haya.auth",
    }
  )
);
