"use client";

import { CheckIcon, CopyIcon, File, Terminal, XIcon } from "lucide-react";
import type * as React from "react";
import { siHtml5, siTypescript } from "simple-icons";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-clipboard";
import { cn } from "@/lib/utils";
import { SimpleIcon } from "../icons";
import { ScrollArea, ScrollBar } from "./scroll-area";

const languages = {
  typescript: { icon: <SimpleIcon icon={siTypescript} /> },
  html: { icon: <SimpleIcon icon={siHtml5} /> },
  bash: { icon: <Terminal /> },
  plaintext: { icon: <File /> },
};

export type SupportedLanguages = keyof typeof languages;

export type CodeBlockProps = Pick<
  React.HTMLAttributes<HTMLDivElement>,
  "className"
> & {
  /** The raw code string to display and copy. */
  code: string;
  /** Optional language hint (e.g. "typescript", "html"). */
  language?: SupportedLanguages;
  /** Optional filename to display in a header bar. */
  filename?: string;
  /** Show line numbers. */
  lineNumbers?: boolean;
  /** Sits in a header row ("inline") or floats in the top-right corner ("corner"). Defaults to "inline" if header is present, else "corner". */
  copyPosition?: "corner" | "inline";
  /** Hide the copy button entirely. */
  hideCopy?: boolean;
  /** Hide the header bar even if filename/language are provided. */
  hideHeader?: boolean;
};

export function CodeBlock({
  code,
  language,
  filename,
  lineNumbers = false,
  copyPosition,
  hideCopy = false,
  hideHeader = false,
  className,
  ...props
}: CodeBlockProps) {
  const { copy, copyState } = useCopyToClipboard();
  const hasHeader = !hideHeader && (filename != null || language != null);

  // Default to "inline" if header is present, else "corner"
  const resolvedCopyPosition =
    copyPosition ?? (hasHeader ? "inline" : "corner");
  const showInlineCopy = !hideCopy && resolvedCopyPosition === "inline";
  const showCornerCopy = !hideCopy && resolvedCopyPosition === "corner";

  const copied = copyState === "copied";
  const copyLabel = copied ? "Copied!" : "Copy code";

  const renderCopyButton = (position: "corner" | "inline") => (
    <Button
      type="button"
      appearance="ghost"
      color="secondary"
      size="icon-sm"
      aria-label={copyLabel}
      title={copyLabel}
      onClick={() => copy(code)}
      className={cn(
        "active:scale-95",
        copied && "text-success hover:bg-success/15 hover:text-success",
        copyState === "error" &&
          "text-destructive hover:bg-destructive/15 hover:text-destructive",
        position === "corner" &&
          "absolute top-2.5 right-2.5 pointer-fine:hover-hover:opacity-0 focus-visible:opacity-100 group-hover:opacity-100",
      )}
    >
      <span
        className={cn(
          "transition-all duration-200",
          copied ? "scale-100" : "scale-110",
        )}
      >
        {copyState === "copied" ? (
          <CheckIcon />
        ) : copyState === "error" ? (
          <XIcon />
        ) : (
          <CopyIcon />
        )}
      </span>
    </Button>
  );

  const lines = lineNumbers && code ? code.split("\n") : null;
  const truncatedFilename = filename?.replace(/.*\/([\w.]+)$/, "$1");

  return (
    <div
      data-language={language}
      data-copy-state={copyState}
      className={cn(
        "group relative rounded-lg border border-secondary bg-background font-mono text-sm",
        className,
      )}
      {...props}
    >
      {hasHeader && (
        <div className="flex items-center justify-between border-secondary border-b px-4 py-2 text-muted-foreground text-xs">
          <div className="flex items-center gap-2">
            {language && (
              <span className="font-sans text-zinc-500 uppercase tracking-widest *:size-4">
                {languages[language].icon}
              </span>
            )}
            {filename && (
              <span className="font-medium font-sans text-foreground">
                <span className="hidden md:inline">{filename}</span>
                <span className="inline md:hidden">{truncatedFilename}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showInlineCopy && renderCopyButton("inline")}
          </div>
        </div>
      )}

      <ScrollArea>
        <pre
          className={cn(
            "px-4 py-3.5 pr-12 text-zinc-200 leading-6 selection:bg-primary selection:text-primary-foreground",
            lineNumbers && "pl-0",
          )}
        >
          {lines ? (
            <code className="flex flex-col">
              {lines.map((line, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: lines are static
                <span key={i} className="flex">
                  <span
                    className="w-10 shrink-0 select-none pr-4 text-right text-xs text-zinc-600 leading-6"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </span>
              ))}
            </code>
          ) : (
            <code>{code}</code>
          )}
        </pre>
        {showCornerCopy && renderCopyButton("corner")}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
