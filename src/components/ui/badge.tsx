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
          "border border-transparent bg-(--bg) text-(--fg) [a&]:hover:opacity-90",
        outline:
          "border border-(--bg) bg-transparent text-(--fg) [a&]:hover:bg-(--bg)/10",
        soft: "border border-transparent bg-(--bg)/15 text-(--bg) [a&]:hover:bg-(--bg)/25",
        ghost:
          "border border-transparent bg-transparent text-(--fg) [a&]:hover:bg-(--bg)/15",
      },
      color: {
        primary: themeColors.primary,
        secondary: themeColors.secondary,
        destructive: themeColors.destructive,
        success: themeColors.success,
        warning: themeColors.warning,
        info: themeColors.info,
        colorful: themeColors.colorful,
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
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    // Map legacy variants for backward compatibility
    variant?:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "success"
      | "warning"
      | "info"
      | "critical"
      | "high"
      | "medium"
      | "low";
  };

function Badge({
  className,
  appearance,
  color,
  size,
  variant,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  let finalAppearance = appearance;
  let finalColor = color;

  // Legacy variant mapping
  if (variant) {
    if (variant === "outline") {
      finalAppearance = "outline";
      finalColor = color || "primary";
    } else if (variant === "secondary") {
      finalAppearance = "solid";
      finalColor = "secondary";
    } else if (variant === "destructive" || variant === "critical") {
      finalAppearance = variant === "critical" ? "soft" : "solid";
      finalColor = "destructive";
    } else if (variant === "success") {
      finalAppearance = "solid";
      finalColor = "success";
    } else if (variant === "warning" || variant === "high") {
      finalAppearance = variant === "high" ? "soft" : "solid";
      finalColor = "warning";
    } else if (variant === "info") {
      finalAppearance = "solid";
      finalColor = "info";
    } else if (variant === "medium") {
      finalAppearance = "soft";
      finalColor = "warning"; // Approximate
    } else if (variant === "low") {
      finalAppearance = "soft";
      finalColor = "success"; // Approximate
    } else {
      finalAppearance = "solid";
      finalColor = "primary";
    }
  }

  return (
    <Comp
      data-slot="badge"
      data-appearance={finalAppearance}
      data-color={finalColor}
      className={cn(
        badgeVariants({ appearance: finalAppearance, color: finalColor, size }),
        className,
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
