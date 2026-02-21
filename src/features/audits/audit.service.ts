import { api } from "@/lib/api";
import { shuffleArray } from "@/lib/utils";
import type { Pagination } from "@/types/type";
import type {
  AuditFilters,
  AuditPage,
  AuditSection,
  AuditWithoutContent,
  NewAudit,
  ParsedAudit,
  RawAudit,
} from "./audit.type";

/** Hacky - change v1 to v2 in all analysis endpoint because of backend version change */

async function getAudits(params?: AuditFilters) {
  const response = await api.get<{
    data: AuditWithoutContent[];
    pagination: Pagination;
  }>(`${api.defaults.baseURL?.replace("v1", "v2")}/analyze/analysis`, {
    params: {
      ...params,
      page: params?.page ?? 1, // Without this, the backend directly returns an array without pagination. Remove when issue is resolved
    },
  });
  return response.data;
}

async function getAudit(auditId: string) {
  const response = await api.get<RawAudit>(
    `${api.defaults.baseURL?.replace("v1", "v2")}/analyze/analysis/${auditId}`,
  );
  return response.data;
}

async function createAudit(payload: NewAudit) {
  const response = await api.post(
    `${api.defaults.baseURL?.replace("v1", "v2")}/analyze/analysis`,
    payload,
  );
  return response.data;
}

async function deleteAudits() {
  const response = await api.delete(
    `${api.defaults.baseURL?.replace("v1", "v2")}/analyze/analysis`,
  );
  return response.data;
}

async function deleteAudit(auditId: string) {
  const response = await api.delete(
    `${api.defaults.baseURL?.replace("v1", "v2")}/analyze/analysis/${auditId}`,
  );
  return response.data;
}

function parseContent(content: string) {
  try {
    let jsonContent = JSON.parse(content || "null");
    if (!jsonContent || typeof jsonContent !== "object") return null;

    const colors: AuditSection["meta"]["accent"][] = shuffleArray([
      "--color-red-300",
      "--color-yellow-300",
      "--color-green-300",
      "--color-blue-300",
      "--color-purple-300",
      "--color-pink-300",
      "--color-emerald-300",
    ]);

    // Add section metadata to content
    jsonContent = {
      ...jsonContent,
      pages: jsonContent.pages.map((page: AuditPage) => ({
        ...page,
        sections: page.sections.map((section: AuditSection, index: number) => ({
          ...section,
          meta: {
            sectionNumber: index + 1,
            accent: colors[index],
          },
        })),
      })),
    };

    console.log("Fetched content", jsonContent);

    return jsonContent as { pages: AuditPage[]; progressPercentage: number };
  } catch (error) {
    console.log("Error parsing analysis content", error, content);
    return null;
  }
}

/** Returns true if audit is in progress or pending or NOT YET DEFINED */
function getIsAuditInProgress(audit?: RawAudit | ParsedAudit) {
  if (!audit) return true;
  return audit.status === "in_progress" || audit.status === "pending";
}

export {
  getAudits,
  getAudit,
  createAudit,
  deleteAudits,
  deleteAudit,
  parseContent,
  getIsAuditInProgress,
};
