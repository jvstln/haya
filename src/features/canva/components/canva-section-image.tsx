import { DocumentUpload } from "iconsax-reactjs";
import { X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export const CanvaSectionImage = ({
  image,
  onImageChange,
}: {
  image?: string;
  onImageChange?: (url: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageChange) {
      const url = URL.createObjectURL(file);
      onImageChange(url);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/") && onImageChange) {
      const url = URL.createObjectURL(file);
      onImageChange(url);
    }
  };

  const placeholder = (
    // biome-ignore lint/a11y/useSemanticElements: false positive
    <div
      role="button"
      tabIndex={0}
      className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md p-4 text-xs transition-colors hover:bg-secondary/50"
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
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
        onChange={handleFileChange}
      />
    </div>
  );

  return (
    <div className="group relative flex h-(--slot-height) w-full flex-col items-center justify-center p-4">
      {image ? (
        <>
          <div className="relative h-full w-full">
            <Image
              src={image}
              alt="Section image"
              className="object-contain"
              fill
            />
          </div>
          {onImageChange && (
            <Button
              color="secondary"
              size="icon"
              className="absolute top-6 right-6 size-6"
              onClick={() => onImageChange("")}
            >
              <X className="size-4" />
              <span className="sr-only">Clear image</span>
            </Button>
          )}
        </>
      ) : (
        placeholder
      )}
    </div>
  );
};
