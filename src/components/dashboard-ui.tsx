// type DashboardHeaderProps = {
//   title: string;
//   cta: React.ReactNode;
// };

import type React from "react";
import { cn } from "@/lib/utils";
import type { Icon } from "./icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

// export const DashboardHeader = ({ title, cta }: DashboardHeaderProps) => {
//   return (
//     <div
//       className="relative flex overflow-hidden rounded-xl border border-transparent"
//       style={{
//         background: `
//           linear-gradient(87.5deg, rgba(30, 30, 30, 0.26) 1.42%, rgba(122 99 255 / 0.26) 99.44%) padding-box,
//           linear-gradient(var(--background), var(--background)) padding-box
//           `,
//       }}
//     >
//       <div className="z-10 flex basis-full flex-col items-start gap-6 p-6 md:basis-3/5">
//         <h1 className="text-base text-white lg:text-h3">{title}</h1>
//         {cta}
//       </div>
//     </div>
//   );
// };

export const DashboardSlot = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col gap-6 p-3 md:p-6",
        "bg-linear-to-b from-primary/5 via-transparent to-transparent",
        className,
      )}
      data-slot="dashboard-slot"
      {...props}
    />
  );
};

export const DashboardHeader = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-start gap-4 rounded-xl border border-secondary bg-muted p-6",
        className,
      )}
      data-slot="dashboard-header"
      {...props}
    >
      {children}
    </div>
  );
};

export const DashboardTitle = ({
  className,
  ...props
}: React.ComponentProps<"h1">) => {
  return (
    <h1
      className={cn(
        "peer text-base text-foreground leading-relaxed lg:text-h3",
        className,
      )}
      data-slot="dashboard-title"
      {...props}
    />
  );
};

export const DashboardDescription = (props: React.ComponentProps<"p">) => {
  return (
    <p
      className="peer-data-[slot=dashboard-title]:[[data-slot=dashboard-header]>&]:-mt-2 text-muted-foreground text-sm"
      {...props}
    />
  );
};

export const DashboardSummary = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(--spacing(40),1fr))] gap-4",
        className,
      )}
      {...props}
    />
  );
};

export const DashboardSummaryCard = ({
  classNames,
  title,
  description,
  value,
  icon: Icon,
  isLoading,
  ...props
}: Pick<React.ComponentProps<typeof Card>, "className"> & {
  classNames?: Partial<Record<"root", string>>;
  title?: React.ReactNode;
  description?: React.ReactNode;
  value?: React.ReactNode;
  icon?: Icon;
  isLoading?: boolean;
}) => {
  const valueLength =
    typeof value === "string" || typeof value === "number"
      ? String(value).length
      : 0;

  if (isLoading) {
    return (
      <Skeleton className={cn("h-24", classNames?.root, props.className)} />
    );
  }

  return (
    <Card
      {...props}
      className={cn("md:min-w-35", classNames?.root, props.className)}
    >
      <CardHeader>
        <CardTitle className="flex justify-between gap-2 font-semibold text-muted-foreground text-sm max-md:flex-col-reverse md:gap-4">
          {title}
          {Icon && (
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-lg bg-(--bg,color-mix(in_oklab,var(--fg,var(--color-primary))_10%,transparent)) text-(--fg,var(--color-primary))",
              )}
            >
              <Icon className="size-4" />
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col">
        <span
          className="font-mono text-foreground tracking-tight"
          style={
            {
              "--length": valueLength,
              fontSize:
                "clamp(var(--text-xs), calc( 1.375rem - var(--length) * (var(--spacing) * 0.1)), var(--text-lg))",
              lineHeight:
                "clamp(1.125rem, calc( 2.25rem - var(--length) * (var(--spacing) * 0.2)), 1.75rem)",
            } as React.CSSProperties
          }
        >
          {value}
        </span>
        {description && <CardDescription>{description}</CardDescription>}
      </CardContent>
    </Card>
  );
};
