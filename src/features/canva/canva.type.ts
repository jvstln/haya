import type { AuditSection } from "../audits/audit.type";

export type CanvaSection = AuditSection & {
  comments: CanvaComment[];
};

export type CanvaComment = {
  author: { name: string; avatar: string };
  comment: string;
};
