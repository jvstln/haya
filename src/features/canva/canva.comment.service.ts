import { api } from "@/lib/api";
import type {
  Comment,
  GetCommentPayload,
  NewComment,
  UpdateComment,
} from "./canva.comment.type";

export async function createComment(payload: NewComment) {
  const response = await api.post("/comments", {
    ...payload,
    analysisId: payload.auditId, // TODO: Get backend to rename analysisId to auditId
  });
  return response.data;
}

export async function updateComment(payload: UpdateComment) {
  const response = await api.put(`/comments/${payload.commendId}`, payload);
  return response.data;
}

export async function deleteComment(commentId: string) {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
}

export async function getCommentsByAnalysisId(auditId: string) {
  const response = await api.get<{
    data: {
      comments: Comment[];
      bySection: Record<`${number}-${number}`, Comment[]>;
    };
  }>(`/comments/analysis/${auditId}`);
  return response.data;
}

export async function getCommentsBySection({
  auditId,
  pageIndex,
  sectionIndex,
}: {
  auditId: string;
  pageIndex: number;
  sectionIndex: number;
}) {
  const response = await api.get<{ data: Comment[] }>(
    `/comments/analysis/${auditId}/page/${pageIndex}/section/${sectionIndex}`,
  );
  return response.data;
}

export async function getCommentsByTeamId(teamId: string) {
  const response = await api.get<{ data: Comment[] }>(
    `/comments/team/${teamId}`,
  );
  return response.data;
}

/**
 * Fetches comments based on the provided payload.
 * Fetches from the most specific payload properties specified to the least specific property.
 * @param params Object of type GetCommentPayload. if pageIndex and sectionIndex is present, it will fetch comments for that specific section. if analysisId is present, it will fetch comments for that specific analysis. if teamId is present, it will fetch comments for that specific team.
 */
export async function getComments(
  params: GetCommentPayload,
): Promise<{ comments: Comment[] }> {
  let comments: Comment[] | null = null;

  if (
    "pageIndex" in params &&
    "sectionIndex" in params &&
    Number.isInteger(params.pageIndex) &&
    Number.isInteger(params.sectionIndex)
  ) {
    comments = (await getCommentsBySection(params)).data;
  } else if ("auditId" in params && params.auditId) {
    comments = (await getCommentsByAnalysisId(params.auditId)).data.comments;
  } else if ("teamId" in params && params.teamId) {
    comments = (await getCommentsByTeamId(params.teamId)).data;
  }

  if (!comments) {
    throw new Error("Failed to aggregrate comments on frontend");
  }

  return { comments };
}
