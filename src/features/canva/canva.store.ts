import { create } from "zustand";
import type { ParsedAudit } from "../audits/audit.type";
import type { CanvaEditorState } from "./canva.type";

const MOCK_COMMENTS = [
  {
    author: { name: "Haya", avatar: "/logo-icon.svg" },
    comment:
      "This section needs a stronger visual hierarchy. Consider increasing the heading size and adding more whitespace between elements.",
    createdAt: new Date().toISOString(),
  },
  {
    author: { name: "@emerie", avatar: "/logo-icon.svg" },
    comment:
      "I agree, let's also update the color palette to match the new brand guidelines.",
    createdAt: new Date().toISOString(),
  },
  {
    author: { name: "Design Team", avatar: "/logo-icon.svg" },
    comment: "The fast-paced animation might be distracting for some users.",
    createdAt: new Date().toISOString(),
  },
  {
    author: { name: "@alex", avatar: "/logo-icon.svg" },
    comment: "Can we check the contrast ratio on this button? It feels low.",
    createdAt: new Date().toISOString(),
  },
  {
    author: { name: "Sarah", avatar: "/logo-icon.svg" },
    comment:
      "Great use of whitespace here, it really lets the content breathe.",
    createdAt: new Date().toISOString(),
  },
  {
    author: { name: "@jordan", avatar: "/logo-icon.svg" },
    comment: "The mobile view for this section looks a bit cluttered.",
    createdAt: new Date().toISOString(),
  },
];

export const createCanvaStore = () => {
  return create<CanvaEditorState>()((set) => ({
    sections: [],
    actions: {
      addSection: () =>
        set((state) => ({
          sections: [
            ...state.sections,
            {
              _id: Date.now() * Math.random(),
              aiAnalysis: null,
              screenshotUrl: "",
              comments: [],
            },
          ],
        })),
      updateSectionScreenshot: (sectionId, screenshotUrl) =>
        set((state) => ({
          sections: state.sections.map((section) =>
            section._id === sectionId ? { ...section, screenshotUrl } : section,
          ),
        })),
      hydrate: ({
        audit,
        pageUrl,
      }: {
        audit: ParsedAudit;
        pageUrl: string;
      }) => {
        const pages = audit.content?.pages;
        const currentPage =
          pages?.find((page) => page.pageUrl === pageUrl) ?? pages?.[0];

        const hydratedSections =
          currentPage?.sections?.map((section) => ({
            _id: Math.random(),
            comments: [...MOCK_COMMENTS]
              .sort(() => 0.5 - Math.random())
              .slice(0, Math.floor(Math.random() * 5) + 2),
            ...section,
          })) ?? [];

        set({
          sections: hydratedSections,
        });
      },
    },
  }));
};
