import { api } from "@/lib/api";
import { shuffleArray } from "@/lib/utils";
import type { Audit, AuditPage, AuditSection, NewAudit } from "./audit.type";

/** Hacky - change v1 to v2 in all analysis endpoint because of backend version change */

async function getAudits() {
  const response = await api.get<Omit<Audit, "content">[]>(
    `${api.defaults.baseURL?.replace("v1", "v2")}/analyze/analysis`
  );
  return response.data;
}

async function getAudit(auditId: string) {
  const response = await api.get<Audit>(
    `${api.defaults.baseURL?.replace("v1", "v2")}/analyze/analysis/${auditId}`
  );
  return response.data;
}

async function createAudit(payload: NewAudit) {
  const response = await api.post<Audit>(
    `${api.defaults.baseURL?.replace("v1", "v2")}/analyze/analysis`,
    payload
  );
  return response.data;
}

async function deleteAudits() {
  const response = await api.delete(
    `${api.defaults.baseURL?.replace("v1", "v2")}/analyze/analysis`
  );
  return response.data;
}

function parseContent(content: string) {
  try {
    let jsonContent = JSON.parse(content);
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

export { getAudits, getAudit, createAudit, deleteAudits, parseContent };
