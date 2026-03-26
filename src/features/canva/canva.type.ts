import type z from "zod";
import type { AuditCustomSection, AuditPage } from "../audits/audit.type";
import type { newSectionSchema } from "./canva.schema";

export type CanvaStore = {
  auditId?: string;
  setAuditId: (auditId?: string) => void;
  pageIndex: number;
  setPageIndex: (pageIndex: number) => void;
  currentPage?: AuditPage;
  setCurrentPage: (page?: AuditPage) => void;
  emptySectionsCount: number;
  addEmptySection: () => void;
  removeEmptySection: () => void;
  customSections: Array<AuditCustomSection>;
  addCustomSection: (section: AuditCustomSection) => void;
  removeCustomSection: (sectionId: AuditCustomSection["_id"]) => void;
};

export type NewSection = z.infer<typeof newSectionSchema>;
