import { MaximizeCircle } from "iconsax-reactjs";
import { useState } from "react";
import { useControls } from "react-zoom-pan-pinch";
import { AiIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InputGroupTextarea } from "@/components/ui/input-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CanvaSection as CanvaSectionType } from "../canva.type";
import { CanvaSectionImage } from "./canva-section-image";

type SlotProps = {
  section: CanvaSectionType;
  onImageChange?: (url: string) => void;
};

export const CanvaSection = ({ section, onImageChange }: SlotProps) => {
  console.log(section);
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

      <CanvaSectionImage
        image={section.screenshotUrl}
        onImageChange={onImageChange}
      />

      <div className="flex w-full flex-col gap-4 p-4">
        {/* Haya analysis  */}
        <CanvaSectionAnalysisResult section={section} />
        {/* Section Comments */}
        {section.comments.map((comment) => (
          <CanvaSectionComment key={comment.comment} comment={comment} />
        ))}

        <CanvaSectionComment
          comment={{ author: { name: "You", avatar: "" }, comment: "" }}
          defaultEditing
        />
      </div>
    </div>
  );
};

const CanvaSectionComment = ({
  comment,
  disabled,
  defaultEditing,
}: {
  comment: CanvaSectionType["comments"][number];
  disabled?: boolean;
  defaultEditing?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(defaultEditing ?? false);
  const [value, setValue] = useState(comment.comment);

  return (
    <div className="flex w-full flex-col gap-2 text-xs">
      <div className="flex items-center gap-2">
        <Avatar className="size-6">
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
          <AvatarImage src={comment.author.avatar} />
        </Avatar>
        <span className="text-muted-foreground">{comment.author.name}</span>
      </div>

      {/** biome-ignore lint/a11y/useSemanticElements: A div is used to provide a focusable, interactive container for multi-line comment text that triggers editing, which avoids the layout and nesting constraints of a semantic button. */}
      <div
        role="button"
        className={cn(
          "no-panning h-(--slot-height) overflow-y-auto rounded-md border border-secondary p-4 text-muted-foreground **:size-full",
          disabled ? "cursor-not-allowed bg-secondary" : "bg-muted",
        )}
        tabIndex={0}
        onDoubleClick={() => {
          if (!isEditing) setIsEditing(true);
        }}
      >
        <ScrollArea type="always" className={cn("h-(--slot-height)")}>
          {isEditing ? (
            <InputGroupTextarea
              className="w-full p-0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsEditing(false);
                }
              }}
              autoFocus
            />
          ) : (
            // biome-ignore lint/a11y/useSemanticElements: A div is used to provide a focusable, interactive container for multi-line comment text that triggers editing, which avoids the layout and nesting constraints of a semantic button.
            <div
              role="button"
              tabIndex={0}
              className=""
              onDoubleClick={() => {
                setIsEditing(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEditing(true);
                }
              }}
            >
              {comment.comment}
            </div>
          )}
          <ScrollBar className="bg-muted" thumbClassName="bg-secondary" />
        </ScrollArea>
      </div>
      {/* <Button
        color="secondary"
        className="absolute right-1 bottom-1 size-4.125 w-fit p-1"
      >
        <MaximizeCircle />
        <span className="sr-only">Maximize comment</span>
      </Button> */}
    </div>
  );
};

const CanvaSectionAnalysisResult = ({
  section,
}: {
  section: CanvaSectionType;
}) => {
  return (
    <div className="flex w-full flex-col gap-2 text-xs">
      <div className="flex items-center gap-2">
        <Avatar className="size-6">
          <AvatarFallback>AI</AvatarFallback>
          <AvatarImage src="/logo-icon.svg" />
        </Avatar>
        <span className="text-muted-foreground">Haya</span>
      </div>

      {section.aiAnalysis ? (
        <ScrollArea
          type="always"
          className={cn(
            "h-(--slot-height) overflow-y-auto rounded-md border border-secondary p-4 text-muted-foreground",
            "cursor-not-allowed bg-secondary",
          )}
          onWheel={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="[&_h3]:mb-4 [&_h3]:font-semibold [&_h3~:not(ul,li)]:ml-3 [&_h4]:mb-2 [&_h4]:font-medium [&_li]:mb-2 [&_section]:mb-4 [&_ul]:list-disc [&_ul]:pl-4">
            <section>
              <h3>Problems</h3>
              {section.aiAnalysis?.problems ? (
                <ul>
                  {section.aiAnalysis.problems.map((problem) => (
                    <li key={problem}>{problem}</li>
                  ))}
                </ul>
              ) : (
                <p className="italic">No problems found</p>
              )}
            </section>

            <section>
              <h3>Solutions</h3>
              {section.aiAnalysis?.solutions ? (
                <ul className="marker:content-[✔️✅☑️]">
                  {section.aiAnalysis.solutions.map((solution) => (
                    <li key={solution}>{solution}</li>
                  ))}
                </ul>
              ) : (
                <p className="italic">No solutions found</p>
              )}
            </section>
          </div>
          <ScrollBar className="bg-muted" thumbClassName="bg-secondary" />
        </ScrollArea>
      ) : (
        <div className="flex h-(--slot-height) flex-col items-center justify-center gap-1 overflow-y-auto rounded-md border border-secondary bg-muted p-4 text-muted-foreground text-xxs">
          <Button color="secondary" size="icon" appearance="outline">
            <AiIcon />
          </Button>
          Haya Ai
        </div>
      )}
    </div>
  );
};
