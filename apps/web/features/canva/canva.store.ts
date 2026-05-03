import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AuditCustomSection,
  AuditPage,
  UploadedImage,
} from "../audits/audit.type";
import type { CanvaStore } from "./canva.type";

export const useCanvaStore = create<CanvaStore>()(
  persist(
    (set) => ({
      pageIndex: 0,
      emptySectionsCount: 0,
      customSections: [],

      setAuditId: (auditId?: string) => {
        set({
          auditId,
          customSections: [],
          currentPage: undefined,
          emptySectionsCount: 0,
        });
      },
      setPageIndex: (pageIndex: number) => {
        set({
          pageIndex,
          customSections: [],
          currentPage: undefined,
          emptySectionsCount: 0,
        });
      },
      setCurrentPage: (page?: AuditPage) => {
        set({ currentPage: page });
      },
      addEmptySection: () => {
        set((state) => ({ emptySectionsCount: state.emptySectionsCount + 1 }));
      },
      removeEmptySection: () => {
        set((state) => ({ emptySectionsCount: state.emptySectionsCount - 1 }));
      },
      addCustomSection: (uploadedImage: UploadedImage | UploadedImage[]) => {
        const parsedCustomSection: AuditCustomSection[] = (
          Array.isArray(uploadedImage) ? uploadedImage : [uploadedImage]
        ).map((image) => ({
          ...image,
          _id: image.imagePublicId + Math.random(),
          aiAnalysis: null,
          sectionName: image.imagePublicId,
        }));

        set((state) => ({
          customSections: [...state.customSections, ...parsedCustomSection],
          // emptySectionsCount: state.emptySectionsCount - 1,
        }));
      },
      removeCustomSection: (sectionId: AuditCustomSection["_id"]) => {
        set((state) => ({
          customSections: state.customSections.filter(
            (section) => section._id !== sectionId,
          ),
          // emptySectionsCount: state.emptySectionsCount + 1,
        }));
      },
    }),
    {
      name: "haya-canva",
      // Don't persist newSections and currentPage
      partialize: ({ customSections, currentPage, ...state }) => state,
    },
  ),
);
