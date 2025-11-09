import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  image?: React.ReactNode;
  title?: string;
  description?: React.ReactNode;
  classNames?: Partial<
    Record<"root" | "image" | "title" | "description", string>
  >;
};

export function EmptyState({
  image = "/images/empty-state.svg",
  title = "Nothing to see here",
  description,
  classNames,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        "flex min-h-90 flex-col items-center justify-center border-dashed bg-gray-25",
        classNames?.root
      )}
    >
      <div>
        {typeof image === "string" ? (
          <div className={cn("relative size-25 md:size-35", classNames?.image)}>
            <Image
              src={image}
              alt="Nothing to see here"
              fill={true}
              className="transition-[brightness] duration-300 hover:brightness-90"
            />
          </div>
        ) : (
          image
        )}
      </div>
      <div className="space-y-2 text-center">
        <h2
          className={cn("font-medium text-lg md:text-2xl", classNames?.title)}
        >
          {title}
        </h2>
        <div
          className={cn(
            "text-xs opacity-80 md:text-sm",
            classNames?.description
          )}
        >
          {description}
        </div>
      </div>
    </Card>
  );
}
