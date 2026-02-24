import Cookies from "js-cookie";
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import type { AuthActions, AuthState } from "./auth.type";

const COOKIE_EXPIRY_DAYS = 7;

// Cookie storage adapter for Zustand persist
export const cookieStorage: StateStorage = {
  getItem: (name) => Cookies.get(name) ?? null,
  setItem: (name, value, options?: Cookies.CookieAttributes) =>
    Cookies.set(name, value, {
      expires: COOKIE_EXPIRY_DAYS,
      sameSite: "lax",
      ...options,
    }),
  removeItem: (name, options?: Cookies.CookieAttributes) => {
    Cookies.remove(name, options);
  },
};

export const useAuthStore = create<
  AuthState &
    AuthActions & {
      hasHydrated: boolean;
      setHasHydrated: (hasHydrated: boolean) => void;
    }
>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hasHydrated: false,

      setAuth: (authState: AuthState) => {
        set(authState);
      },
      resetAuth: () => {
        set({ accessToken: null, refreshToken: null, user: null });
        // Disconnect wallet if connected
        if (window.solana?.disconnect) {
          window.solana.disconnect();
        }
      },
      setHasHydrated: (state: boolean) => {
        set({ hasHydrated: state });
      },
    }),
    {
      name: "haya.auth",
      storage: createJSONStorage(() => cookieStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      // Prevent hydrated state from being stored in storage
      partialize: ({ hasHydrated, ...state }) => state,
    },
  ),
);
