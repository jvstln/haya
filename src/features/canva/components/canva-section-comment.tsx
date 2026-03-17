"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { CloseSquare, MaximizeCircle, TickSquare } from "iconsax-reactjs";
import { MoreVerticalIcon } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroupTextarea } from "@/components/ui/input-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { HayaSpinner } from "@/components/ui/spinner";
import type { User } from "@/features/users/user.type";
import { cn, getInitials } from "@/lib/utils";

type CommentActionProps = {
  comment: string;
  setComment: (comment: CommentActionProps["comment"]) => void;
};

type CanvaSectionCommentProps = {
  comment: React.ReactNode;
  user: User;
  canEdit?: boolean;
  canDelete?: boolean;
  defaultEditing?: boolean;
  isLoading?: boolean;
  onCommentSave?: (props: CommentActionProps) => void | Promise<void>;
  onCommentCancel?: (props: CommentActionProps) => void | Promise<void>;
  onCommentDelete?: (props: CommentActionProps) => void | Promise<void>;
};

export const CanvaSectionComment = ({
  comment,
  user,
  defaultEditing,
  isLoading: controlledIsLoading,
  canEdit,
  canDelete,
  onCommentSave,
  onCommentCancel,
  onCommentDelete,
}: CanvaSectionCommentProps) => {
  const [commentValue, setCommentValue] = useState(comment);
  const [isEditing, _setIsEditing] = useState(defaultEditing ?? false);
  const [_isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isLoading = controlledIsLoading ?? _isLoading;

  const setIsEditing = (isEditing: boolean) => {
    // Dont switch editing state if any of these conditions are met
    if (!canEdit && isEditing) return;
    if (isLoading) return;

    _setIsEditing(isEditing);
    console.log("editing comment", isEditing);
  };

  const actionProps = {
    comment: String(commentValue),
    setComment: setCommentValue,
  };

  const handleCommentSave = async () => {
    try {
      setIsLoading(true);
      await onCommentSave?.(actionProps);
      setIsEditing(false);
    } catch {
      setCommentValue(comment);
    } finally {
      setIsLoading(false);
    }
    console.log("saved comment");
  };

  const handleCommentCancel = async () => {
    await onCommentCancel?.(actionProps);
    setCommentValue(comment);
    setIsEditing(false);
    console.log("discarded comment");
  };

  const handleCommentDelete = async () => {
    try {
      setIsLoading(true);
      await onCommentDelete?.(actionProps);
    } finally {
      setIsLoading(false);
    }
    console.log("deleted comment");
  };

  return (
    <div className="flex w-full flex-col gap-2 text-xs">
      <div className="flex items-center gap-2">
        <Avatar className="size-6">
          <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          {/* <AvatarImage src={comment.author.avatar} /> */}
        </Avatar>
        <span className="text-muted-foreground">{user.username}</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              appearance="ghost"
              color="secondary"
              className="ml-auto size-auto rounded-sm p-1"
            >
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsExpanded(true)}>
              View
            </DropdownMenuItem>
            {canEdit && (
              <DropdownMenuItem
                onClick={() => setIsEditing(true)}
                disabled={isEditing}
              >
                Edit
              </DropdownMenuItem>
            )}
            {canDelete && (
              <DropdownMenuItem
                onClick={handleCommentDelete}
                data-variant="destructive"
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {isEditing && (
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              appearance="outline"
              color="success"
              className="size-auto"
              onClick={handleCommentSave}
              isLoading={isLoading}
            >
              <TickSquare className="size-5" />
            </Button>
            <Button
              size="icon"
              appearance="outline"
              color="destructive"
              className="size-auto"
              onClick={handleCommentCancel}
              disabled={isLoading}
            >
              <CloseSquare className="size-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Comment area */}
      {/* Classes and styles gotten from @/components/ui/scroll-area.tsx */}
      <ScrollAreaPrimitive.Root
        type="always"
        data-slot="scroll-area"
        className={cn(
          "no-panning relative h-(--slot-height) overflow-hidden rounded-lg border border-secondary bg-muted text-muted-foreground focus-within:ring-2",
          !isEditing && "p-4",
        )}
        // Prevent canva controlls when inside comment area
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        // Editing events
        tabIndex={0}
        onDoubleClick={() => {
          if (!isEditing) setIsEditing(true);
          if (!canEdit) setIsExpanded(true);
        }}
        onKeyDown={(e) => {
          if (!isEditing && e.key === "Enter") setIsEditing(true);
          if (isEditing && e.key === "Escape") handleCommentCancel();
        }}
        onBlur={(e) => {
          // Don't cancel if focus is moving to a child element within this container
          if (e.currentTarget.contains(e.relatedTarget)) return;
          // Don't cancel if focus left the document entirely (e.g. tab/window switch)
          if (!e.relatedTarget) return;
          handleCommentCancel();
        }}
      >
        <ScrollAreaPrimitive.Viewport
          data-slot="scroll-area-viewport"
          className="size-full outline-none transition-[color,box-shadow] *:h-full focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {isLoading && (
            <div className="absolute inset-0 flex cursor-wait items-center justify-center bg-black/70">
              <HayaSpinner />
            </div>
          )}
          {isEditing ? (
            <InputGroupTextarea
              value={String(commentValue)}
              onChange={(e) => setCommentValue(e.target.value)}
              className="h-full bg-neutral-900"
              autoFocus
            />
          ) : (
            commentValue
          )}

          <ScrollAreaPrimitive.ScrollAreaScrollbar
            data-slot="scroll-area-scrollbar"
            orientation="vertical"
            className={cn(
              "flex touch-none select-none p-px transition-colors",
              "h-full w-5 border-l border-l-transparent", // Vertical orientation styles
              "pt-1 pb-6", // New styles
            )}
          >
            <ScrollAreaPrimitive.ScrollAreaThumb
              data-slot="scroll-area-thumb"
              className={cn(
                "relative mx-auto max-w-2.5 flex-1 rounded-full bg-white/70",
              )}
            />
            <Button
              className="-translate-x-1/2 absolute bottom-1 left-1/2 size-4 rounded-sm p-0!"
              color="secondary"
              onClick={() => setIsExpanded(true)}
            >
              <MaximizeCircle className="size-2.5" />
              <span className="sr-only">Maximize comment</span>
            </Button>
          </ScrollAreaPrimitive.ScrollAreaScrollbar>
        </ScrollAreaPrimitive.Viewport>
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>

      {/* Expanded comment dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
              </Avatar>
              <span>{user.username}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="relative min-h-0 flex-1">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex cursor-wait items-center justify-center rounded-lg bg-black/70">
                <HayaSpinner />
              </div>
            )}
            <ScrollArea
              type="always"
              className={cn(
                "h-full max-h-[60vh] rounded-lg border border-secondary bg-muted text-muted-foreground text-sm",
                !isEditing && "p-4",
              )}
              onWheel={(e) => e.stopPropagation()}
            >
              {isEditing ? (
                <InputGroupTextarea
                  value={String(commentValue)}
                  onChange={(e) => setCommentValue(e.target.value)}
                  className="min-h-[200px] bg-neutral-900"
                  autoFocus
                />
              ) : (
                <p className="min-h-[200px] whitespace-pre-wrap">
                  {commentValue}
                </p>
              )}
              <ScrollBar />
            </ScrollArea>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {isEditing ? (
              <>
                <Button
                  appearance="outline"
                  color="destructive"
                  onClick={handleCommentCancel}
                  disabled={isLoading}
                  size="sm"
                >
                  <CloseSquare className="size-4" />
                  Cancel
                </Button>
                <Button
                  appearance="outline"
                  color="success"
                  onClick={handleCommentSave}
                  isLoading={isLoading}
                  size="sm"
                >
                  <TickSquare className="size-4" />
                  Save
                </Button>
              </>
            ) : (
              <>
                {canEdit && (
                  <Button
                    appearance="outline"
                    onClick={() => setIsEditing(true)}
                    size="sm"
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                )}
                {canDelete && (
                  <Button
                    appearance="outline"
                    color="destructive"
                    onClick={handleCommentDelete}
                    size="sm"
                    disabled={isLoading}
                  >
                    Delete
                  </Button>
                )}
                <DialogClose asChild>
                  <Button size="sm" appearance="outline" color="secondary">
                    Close
                  </Button>
                </DialogClose>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
