import type * as React from "react";

import { cn } from "@/lib/utils";

export const inputSizeClassName = cn(
  "h-8.75 w-full min-w-0 rounded-md text-xs data-[size=lg]:h-17.5",
);

export const inputColorClassName = cn(
  "border-transparent [background:linear-gradient(var(--color-secondary),var(--color-secondary))_padding-box,var(--colorful-gradient)_border-box] selection:bg-primary selection:text-primary-foreground file:bg-transparent file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring disabled:opacity-50 data-placeholder:text-muted-foreground data-disabled:opacity-50",
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
        "border shadow-xs outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:font-medium file:text-sm disabled:pointer-events-none disabled:cursor-not-allowed data-disabled:cursor-not-allowed",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "px-4 py-4",
        className,
      )}
      {...props}
    />
  );
}
