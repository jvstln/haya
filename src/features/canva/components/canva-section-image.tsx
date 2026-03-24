"use client";
import { DocumentUpload, MaximizeCircle } from "iconsax-reactjs";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const CanvaSectionImage = ({
  image,
  onImageChange,
}: {
  image?: string;
  onImageChange?: (file: File) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files?: File[] | FileList | null) => {
    if (files && onImageChange) {
      onImageChange(files[0]);
    }
  };

  const placeholder = (
    // biome-ignore lint/a11y/useSemanticElements: false positive
    <div
      role="button"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        handleFileChange(e.dataTransfer.files);
        setIsDragging(false);
      }}
      tabIndex={0}
      className={cn(
        "flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md p-4 text-xs transition-colors hover:bg-secondary/50",
        isDragging && "border border-secondary border-dashed bg-secondary/50",
      )}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <DocumentUpload className="size-5.5 rounded-sm bg-secondary p-1 text-muted-foreground" />
      Drag and drop or click to upload
      <input
        type="file"
        className="hidden"
        accept="image/*"
        ref={inputRef}
        onChange={(e) => {
          handleFileChange(e.target.files);
        }}
      />
    </div>
  );

  return (
    <div className="group relative flex h-(--slot-height) w-full flex-col items-center justify-center p-4">
      {/* Expand image button */}
      <Button
        color="secondary"
        appearance="ghost"
        size="icon"
        className="absolute right-1 bottom-1 z-10 size-auto rounded-sm p-1"
        onClick={() => setIsExpanded(true)}
      >
        <MaximizeCircle />
        <span className="sr-only">Maximize comment</span>
      </Button>

      {image ? (
        <div className="relative h-full w-full">
          <Image
            src={image}
            alt="Section image"
            className="object-contain"
            fill
          />
        </div>
      ) : (
        placeholder
      )}

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="flex h-full flex-col">
          <DialogHeader>
            <DialogTitle>Section image</DialogTitle>
          </DialogHeader>

          <div className="relative size-full grow">
            {image ? (
              <Image
                src={image}
                alt="Section image"
                className="object-contain"
                fill
              />
            ) : (
              placeholder
            )}
          </div>

          <DialogFooter>
            <Button
              color="secondary"
              appearance="outline"
              onClick={() => setIsExpanded(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
