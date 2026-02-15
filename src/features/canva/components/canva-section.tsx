import { DocumentUpload } from "iconsax-reactjs";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { CanvaSection as CanvaSectionType } from "../canva.type";

type SlotProps = {
  section: CanvaSectionType;
};

export const CanvaSection = ({ section }: SlotProps) => {
  return (
    <div
      className="relative flex w-(--slot-width) flex-col items-center justify-center"
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
        <CanvaSectionAnalysisResult section={section} />

        {/* Section Comments */}
        {section.comments.map((comment) => (
          <CanvaSectionComment key={comment.comment} comment={comment} />
        ))}
      </div>
    </div>
  );
};

const CanvaSectionImage = ({ image }: { image?: string }) => {
  const placeholder = (
    <div className="flex flex-col items-center justify-center gap-1.5 text-xs">
      <DocumentUpload className="size-5.5 rounded-sm bg-secondary p-1 text-muted-foreground" />
      Drag and drop or click to upload image
    </div>
  );

  return (
    <div className="relative flex h-(--slot-height) w-full flex-col items-center justify-center p-4">
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
    </div>
  );
};

const CanvaSectionComment = ({
  comment,
  disabled,
}: {
  comment: CanvaSectionType["comments"][number];
  disabled?: boolean;
}) => {
  return (
    <div className="flex w-full flex-col gap-2 text-xs">
      <div className="flex items-center gap-2">
        <Avatar className="size-6">
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
          <AvatarImage src={comment.author.avatar} />
        </Avatar>
        <span className="text-muted-foreground">{comment.author.name}</span>
      </div>

      <ScrollArea
        type="always"
        className={cn(
          "h-(--slot-height) overflow-y-auto rounded-md border border-secondary p-4 text-muted-foreground",
          disabled ? "cursor-not-allowed bg-secondary" : "bg-muted",
        )}
      >
        <div className="" contentEditable>
          {comment.comment}
        </div>
        <ScrollBar className="bg-muted" thumbClassName="bg-secondary" />
      </ScrollArea>
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

      <ScrollArea
        type="always"
        className={cn(
          "h-(--slot-height) overflow-y-auto rounded-md border border-secondary p-4 text-muted-foreground",
          "cursor-not-allowed bg-secondary",
        )}
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
    </div>
  );
};
