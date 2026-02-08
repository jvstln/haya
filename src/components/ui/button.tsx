import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      appearance: {
        solid: "bg-(--bg) text-(--fg)",
        ghost: "bg-transparent text-(--fg) hover:bg-(--bg)",
        outline:
          "border border-(--bg) bg-transparent text-(--fg) hover:bg-(--bg)",
      },
      color: {
        primary:
          "[--bg:var(--color-primary)] [--fg:var(--color-primary-foreground)]",
        secondary:
          "[--bg:var(--color-secondary)] [--fg:var(--color-secondary-foreground)]",
        destructive:
          "[--bg:var(--color-destructive)] [--fg:var(--color-white)]",
      },
      // variant: {
      //   default: "bg-primary text-primary-foreground hover:bg-primary/90",
      //   glass: "bg-border text-foreground hover:bg-border/90",
      //   "glass-primary": "bg-primary/15 text-primary hover:bg-primary/25",
      //   ghost:
      //     "hover:bg-border data-[active=true]:bg-border dark:data-[active=true]:bg-border/50 dark:hover:bg-border/50",
      //   colorful: "bg-(image:--colorful-gradient) text-background",
      //   destructive:
      //     "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
      //   "destructive-outline":
      //     "border border-destructive bg-transparent text-destructive hover:bg-destructive/10 focus-visible:ring-destructive/20",
      //   outline:
      //     "border bg-background shadow-xs hover:bg-border dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
      //   secondary:
      //     "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      //   link: "text-primary underline-offset-4 hover:underline",
      // },
      size: {
        default: "h-8.75 px-6 py-2 text-sm has-[>svg]:px-3",
        sm: "h-7 gap-1.5 px-3 text-body-4 has-[>svg]:px-2.5",
        lg: "h-12.75 px-6 has-[>svg]:px-4",
        icon: "size-8.75",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      appearance: "solid",
      color: "secondary",
      // variant: "default",
      size: "default",
    },
  },
);

function Button({
  // Variants
  appearance,
  color,
  size,

  className,
  asChild = false,
  isLoading,
  loadingText,
  children: defaultChildren,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    loadingText?: string;
  }) {
  const Comp = asChild ? Slot : "button";
  const LoadingComp = asChild ? "div" : React.Fragment;

  const children = isLoading ? (
    <LoadingComp>
      <Spinner />
      {loadingText}
    </LoadingComp>
  ) : (
    defaultChildren
  );

  return (
    <Comp
      data-slot="button"
      data-size={size}
      data-appearance={appearance}
      data-color={color}
      className={cn(buttonVariants({ appearance, color, size, className }))}
      {...props}
      disabled={isLoading || props.disabled}
    >
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
