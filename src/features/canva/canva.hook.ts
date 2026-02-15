import { useQuery } from "@tanstack/react-query";
import { useAudit, useAudits } from "../audits/audit.hook";
import type { CanvaSection } from "./canva.type";

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

export const useCanvaEdits = () => {
  // 1. Fetch all audits to get an ID (Mocking "current" audit selection by taking the first one)
  const audits = useAudits();
  const auditId = audits.data?.data?.[0]?._id;
  // 2. Fetch the specific audit content
  const audit = useAudit(auditId ?? "");

  return useQuery({
    queryKey: ["canvaEdits"],
    queryFn: async () => {
      if (audit.error || audits.error) {
        throw new Error(
          audit.error?.message || audits.error?.message || "Error occurred",
        );
      }

      // 3. Transform AuditSection -> CanvaSection
      const canvaSections: CanvaSection[] =
        audit.data?.content?.pages?.[0]?.sections?.map((section) => ({
          ...section,
          comments: [...MOCK_COMMENTS]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 5) + 2),
        })) ?? [];

      console.log("canva sections", canvaSections, audit, audits);

      return canvaSections;
    },
  });
};
