"use client";

import { useCopyToClipboard } from "@uidotdev/usehooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TagInstallationProps {
  stepNumber?: number;
  className?: string;
}

export function TagInstallation({
  stepNumber,
  className,
}: TagInstallationProps) {
  const [copied, copy] = useCopyToClipboard();
  const commandText = "npx @haya/wizard";

  return (
    <Card className={cn("flex flex-row", className)}>
      {stepNumber !== undefined && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-bold text-primary text-sm">
          {stepNumber}
        </div>
      )}
      <div className="grow">
        <CardHeader className="flex-row items-start gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg">Tag Installation</CardTitle>
            <CardDescription className="max-w-3xl leading-relaxed">
              Paste a single command. Our Wizard CLI automatically detects your
              framework, installs the SDK, scans your codebase to suggest custom
              event tracking, configures MCP, and handles the rest.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="mt-2">
          <div className="flex w-full flex-col items-center justify-between gap-4 rounded-xl border border-border/40 bg-black/40 p-4 font-mono text-sm sm:flex-row">
            <span className="select-all text-white">{commandText}</span>
            <Button
              onClick={async () => {
                await copy(commandText);
                toast.success("Command copied to clipboard!");
              }}
              color="primary"
              className="w-full rounded-full sm:w-auto"
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
