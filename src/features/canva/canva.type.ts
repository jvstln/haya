import type { AuditSection, ParsedAudit } from "../audits/audit.type";

export type CanvaSection = Pick<
  AuditSection,
  "aiAnalysis" | "screenshotUrl"
> & {
  _id: string | number;
  comments: CanvaComment[];
};

export type CanvaComment = {
  author: { name: string; avatar: string };
  comment: string;
};

export type CanvaEditorState = {
  sections: CanvaSection[];
  actions: {
    addSection: () => void;
    updateSectionScreenshot: (
      sectionId: string | number,
      screenshotUrl: string,
    ) => void;
    hydrate: ({
      audit,
      pageUrl,
    }: {
      audit: ParsedAudit;
      pageUrl: string;
    }) => void;
  };
};
