import type * as React from "react";

import { cn } from "@/lib/utils";

export const inputSizeClassName = cn(
  "h-11 rounded-md px-4 py-3 data-[size=lg]:h-17.5"
);

export const inputColorClassName = cn(
  "border-border bg-[linear-gradient(var(--color-border),var(--color-red-500))_content-box,var(--colorful-gradient)_border-box] selection:bg-primary selection:text-primary-foreground file:bg-transparent file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring disabled:opacity-50 data-placeholder:text-muted-foreground data-disabled:opacity-50"
);

export function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        inputSizeClassName,
        inputColorClassName,
        "w-full min-w-0 border text-base shadow-xs outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:font-medium file:text-sm disabled:pointer-events-none disabled:cursor-not-allowed data-disabled:cursor-not-allowed md:text-sm dark:bg-input/30",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  );
}
