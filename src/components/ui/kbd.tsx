import type * as React from "react";

import { cn } from "@/lib/utils";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1 font-medium font-mono text-muted-foreground text-xxs shadow-[0_1px_0_1px] shadow-border",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
