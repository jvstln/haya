import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryclient";
import { isEmpty } from "@/lib/utils";
import * as CanvaCommentService from "./canva.comment.service";
import type { GetCommentPayload } from "./canva.comment.type";

export function useComments(params: GetCommentPayload) {
  return useQuery({
    queryKey: ["comments", params],
    queryFn: () => CanvaCommentService.getComments(params),
    enabled: !isEmpty(params),
  });
}

/**
 *
 * @param params Props accepted by useComments solely for the purpose of invalidating the correct comments
 */
export function useCreateComment(params?: GetCommentPayload) {
  return useMutation({
    mutationFn: CanvaCommentService.createComment,
    onSuccess: (data) => {
      toast.success(data.message || "Comment added successfully", {
        description: null,
      });
      queryClient.invalidateQueries({
        queryKey: !isEmpty(params) ? ["comments", params] : ["comments"],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add comment");
    },
  });
}

/**
 *
 * @param params Props accepted by useComments solely for the purpose of invalidating the correct comments
 */
export const useUpdateComment = (params?: GetCommentPayload) => {
  return useMutation({
    mutationFn: CanvaCommentService.updateComment,
    onSuccess: (data) => {
      toast.success(data.message || "Comment updated successfully", {
        description: null,
      });
      queryClient.invalidateQueries({
        queryKey: !isEmpty(params) ? ["comments", params] : ["comments"],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update comment");
    },
  });
};

/**
 *
 * @param params Props accepted by useComments solely for the purpose of invalidating the correct comments
 */
export const useDeleteComment = (params?: GetCommentPayload) => {
  return useMutation({
    mutationFn: CanvaCommentService.deleteComment,
    onSuccess: (data) => {
      toast.success(data.message || "Comment deleted successfully", {
        description: null,
      });
      queryClient.invalidateQueries({
        queryKey: !isEmpty(params) ? ["comments", params] : ["comments"],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete comment");
    },
  });
};
