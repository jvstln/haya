import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";
import { themeColors } from "../../lib/color.util";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md font-medium text-xs transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      appearance: {
        solid:
          "border border-transparent bg-(--bg-v) text-(--fg-v) [a&]:hover:opacity-90",
        outline:
          "border border-(--bg-v) bg-transparent text-(--fg-v) [a&]:hover:bg-(--bg-v)/10",
        soft: "border border-transparent bg-(--bg-v)/15 text-(--bg-v) [a&]:hover:bg-(--bg-v)/25",
        ghost:
          "border border-transparent bg-transparent text-(--bg-v) [a&]:hover:bg-(--bg-v)/15",
      },
      color: {
        primary: themeColors.primary,
        secondary: themeColors.secondary,
        destructive: themeColors.destructive,
        success: themeColors.success,
        warning: themeColors.warning,
        info: themeColors.info,
        neutral: themeColors.neutral,
        colorful: themeColors.colorful,
      },
      inverted: {
        true: "[--bg-v:var(--fg)] [--fg-v:var(--bg)]",
        false: "[--bg-v:var(--bg)] [--fg-v:var(--fg)]",
      },
      size: {
        default: "h-7 px-4 py-2 text-xs",
        sm: "h-5 px-2.5 py-0.5 text-[10px]",
      },
    },
    defaultVariants: {
      appearance: "solid",
      color: "primary",
      size: "default",
      inverted: false,
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };

function Badge({
  className,
  appearance,
  color,
  inverted,
  size,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      data-appearance={appearance}
      data-color={color}
      data-inverted={inverted || undefined}
      className={cn(
        badgeVariants({ appearance, color, inverted, size }),
        className,
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
