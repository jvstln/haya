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
        link: "text-(--bg) underline-offset-4 hover:underline",
        soft: "bg-(--bg)/15 text-(--bg) hover:bg-(--bg)/25",
      },
      color: {
        primary:
          "[--bg:var(--color-primary)] [--fg:var(--color-primary-foreground)]",
        secondary:
          "[--bg:var(--color-secondary)] [--fg:var(--color-secondary-foreground)]",
        destructive:
          "[--bg:var(--color-destructive)] [--fg:var(--color-white)]",
        colorful:
          "bg-(image:--bg) [--bg:var(--colorful-gradient)] [--fg:var(--color-white)]",
      },
      size: {
        default: "h-8.75 px-6 py-2 has-[>svg]:px-3",
        sm: "h-7 gap-1.5 px-3 font-semibold text-xs has-[>svg]:px-2.5",
        lg: "h-12.75 px-6 has-[>svg]:px-4",
        icon: "size-8.75",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      appearance: "solid",
      color: "primary",
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
