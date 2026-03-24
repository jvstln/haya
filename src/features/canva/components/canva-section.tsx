"use client";

import { MenuIcon } from "lucide-react";
import { toast } from "sonner";
import { AiIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { HayaSpinner } from "@/components/ui/spinner";
import type { AuditSection } from "@/features/audits/audit.type";
import {
  ProblemsAndSolutionsCaseSection,
  SeoCaseSection,
} from "@/features/audits/components/cases/case-content";
import { useAuth } from "@/features/auth/auth.hook";
import { cn } from "@/lib/utils";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from "../canva.comment.hook";
import { useCreateSection } from "../canva.hook";
import { newSectionSchema } from "../canva.schema";
import { useCanvaStore } from "../canva.store";
import { CanvaSectionComment } from "./canva-section-comment";
import { CanvaSectionImage } from "./canva-section-image";

type SlotProps = {
  section: AuditSection;
  sectionIndex: number;
};

type CanvaSectionCoreProps = {
  children?: React.ReactNode;
  classNames?: Partial<Record<"container", string>>;
  isLoading?: boolean;
  imageProps?: React.ComponentProps<typeof CanvaSectionImage>;
};

const CanvaSectionCore = ({
  children,
  classNames,
  isLoading,
  imageProps,
}: CanvaSectionCoreProps) => {
  return (
    <div
      className={cn(
        "relative flex min-w-(--slot-width) max-w-(--slot-width) flex-col items-center",
        classNames?.container,
      )}
      data-slot="canva-slot"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            color="secondary"
            appearance="ghost"
            size="icon"
            // className="absolute top-1 right-1 z-10 size-auto rounded-sm p-1"
            className="self-end"
            data-slot="section-menu"
          >
            <MenuIcon />
            <span className="sr-only">Section menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem data-variant="destructive">
            Remove Slide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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

      {isLoading ? (
        <Skeleton className="grid h-(--slot-height) w-full place-content-center">
          <HayaSpinner />
        </Skeleton>
      ) : (
        <CanvaSectionImage {...imageProps} />
      )}

      <div className="flex w-full flex-col gap-4 p-4">
        {isLoading ? (
          <Skeleton className="h-(--slot-height) w-full" />
        ) : (
          children
        )}
      </div>
    </div>
  );
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
    <CanvaSectionCore imageProps={{ image: section.screenshotUrl }}>
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
    </CanvaSectionCore>
  );
};

export const NewCanvaSection = () => {
  const auth = useAuth();
  const auditId = useCanvaStore((state) => state.auditId);
  const createNewSection = useCreateSection();

  const isLoading = createNewSection.isPending;

  return (
    <CanvaSectionCore
      isLoading={isLoading}
      classNames={{ container: "bg-primary/10" }}
      imageProps={{
        onImageChange(file) {
          const parsedPayload = newSectionSchema.safeParse({
            image: file,
            auditId,
          });

          if (!parsedPayload.success) {
            return toast.error(parsedPayload.error.issues[0].message, {
              description: parsedPayload.error.issues
                .slice(1)
                .map((issue) => issue.message)
                .join(", "),
            });
          }

          createNewSection.mutate(parsedPayload.data);
        },
      }}
    >
      {auth.user && (
        <CanvaSectionComment
          comment={
            <div className="flex size-full flex-col items-center justify-center gap-1 overflow-y-auto rounded-md border border-secondary bg-muted p-4 text-muted-foreground text-xxs">
              You need to add an image before adding comments
            </div>
          }
          user={auth.user}
        />
      )}
    </CanvaSectionCore>
  );
};
