import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CanvaStore } from "./canva.type";

export const useCanvaStore = create<CanvaStore>()(
  persist(
    (set) => ({
      pageIndex: 0,
      newSections: [],
      setAuditId: (auditId: string) => {
        set({ auditId, newSections: [] });
      },
      setPageIndex: (pageIndex: number) => {
        set({ pageIndex, newSections: [] });
      },
      addNewSection: () => {
        set((state) => ({
          newSections: [...state.newSections, { _id: Date.now() }],
        }));
      },
    }),
    {
      name: "haya-canva",
    },
  ),
);
