import type z from "zod";
import type { newSectionSchema } from "./canva.schema";

export type CanvaStore = {
  auditId?: string;
  setAuditId: (auditId: string) => void;
  pageIndex: number;
  setPageIndex: (pageIndex: number) => void;

  newSections: Array<{ _id: string | number }>;
  addNewSection: () => void;
};

export type NewSection = z.infer<typeof newSectionSchema>;
