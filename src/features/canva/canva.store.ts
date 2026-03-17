import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import type { CanvaStore } from "./canva.type";

export const useCanvaStore = create<CanvaStore>()(
  persist(
    subscribeWithSelector((_set) => ({ pageIndex: 0 })),
    { name: "haya-canva" },
  ),
);

useCanvaStore.subscribe(
  (state) => state.auditId,
  (_auditId) => {
    // Reset some necessary state when the auditId changes
  },
);
