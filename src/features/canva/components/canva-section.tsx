"use client";

import { AiIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { AuditSection } from "@/features/audits/audit.type";
import {
  ProblemsAndSolutionsCaseSection,
  SeoCaseSection,
} from "@/features/audits/components/cases/case-content";
import { useAuth } from "@/features/auth/auth.hook";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from "../canva.comment.hook";
import { useCanvaStore } from "../canva.store";
import { CanvaSectionComment } from "./canva-section-comment";
import { CanvaSectionImage } from "./canva-section-image";

type SlotProps = {
  section: AuditSection;
  sectionIndex: number;
};

export const CanvaSection = ({ section, sectionIndex }: SlotProps) => {
  const auth = useAuth();
  const auditId = useCanvaStore((state) => state.auditId);
  const pageIndex = useCanvaStore((state) => state.pageIndex);

  const commentParams = { auditId: auditId ?? "", pageIndex, sectionIndex };

  const comments = useComments(commentParams);
  const createComment = useCreateComment(commentParams);
  const updateComment = useUpdateComment(commentParams);
  const deleteComment = useDeleteComment(commentParams);

  return (
    <div
      className="relative flex min-w-(--slot-width) max-w-(--slot-width) flex-col items-center justify-center"
      data-slot="canva-slot"
    >
      {/* Customizable vertical dashed border using SVG */}
      <svg
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
        fill="none"
        aria-hidden="true"
      >
        <line
          x1="100%"
          y1="0"
          x2="100%"
          y2="100%"
          strokeWidth="2"
          strokeDasharray="10,10"
          className="stroke-secondary"
        />
      </svg>

      <CanvaSectionImage image={section.screenshotUrl} />

      <div className="flex w-full flex-col gap-4 p-4">
        {/* Haya analysis  */}
        <CanvaSectionComment
          comment={
            section.aiAnalysis ? (
              <>
                <ProblemsAndSolutionsCaseSection section={section} />
                <SeoCaseSection section={section} />
              </>
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-1 overflow-y-auto rounded-md border border-secondary bg-muted p-4 text-muted-foreground text-xxs">
                <Button color="secondary" size="icon" appearance="outline">
                  <AiIcon />
                </Button>
                Haya Ai
              </div>
            )
          }
          user={{ _id: "ai", username: "Haya" }}
        />

        {/* Section Comments */}
        {comments.data?.comments.map((comment) => (
          <CanvaSectionComment
            key={comment._id}
            comment={comment.comment}
            user={comment.user}
            canEdit={comment.user._id === auth.user?._id}
            canDelete={comment.user._id === auth.user?._id}
            onCommentSave={async ({ comment: updatedComment }) => {
              await updateComment.mutateAsync({
                commendId: comment._id,
                comment: updatedComment,
              });
            }}
            onCommentDelete={async () => {
              await deleteComment.mutateAsync(comment._id);
            }}
          />
        ))}

        {auth.user && (
          <CanvaSectionComment
            comment=""
            user={auth.user}
            canEdit
            onCommentSave={async ({ comment, setComment }) => {
              if (!auditId) return;
              await createComment.mutateAsync({
                comment,
                auditId,
                pageIndex,
                sectionIndex,
              });
              setComment("");
            }}
          />
        )}
      </div>
    </div>
  );
};
