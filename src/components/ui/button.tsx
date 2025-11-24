import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        glass: "bg-border text-foreground hover:bg-border/90",
        "glass-primary": "bg-primary/15 text-primary hover:bg-primary/25",
        ghost:
          "hover:bg-border data-[active=true]:bg-border dark:data-[active=true]:bg-border/50 dark:hover:bg-border/50",
        colorful: "bg-(image:--colorful-gradient) text-background",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        "destructive-outline":
          "border border-destructive bg-transparent text-destructive hover:bg-destructive/10 focus-visible:ring-destructive/20",
        outline:
          "border bg-background shadow-xs hover:bg-border dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8.75 px-6 py-2 has-[>svg]:px-3",
        sm: "h-7 gap-1.5 rounded-md px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-12.75 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-8.75",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
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
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      disabled={isLoading || props.disabled}
    >
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
