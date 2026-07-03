import { create } from "zustand";
import { persist } from "zustand/middleware";

type GlobalStore = {
  isFirstTimeUser: boolean;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      isFirstTimeUser: true,
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "haya.global",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: ({ hasHydrated, ...state }) => state,
    },
  ),
);
