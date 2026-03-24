"use client";

import { Add } from "iconsax-reactjs";
import type React from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { QueryState } from "@/components/query-states";
import { Button } from "@/components/ui/button";
import type { useAudit } from "@/features/audits/audit.hook";
import { cn } from "@/lib/utils";
import { useCanvaStore } from "../canva.store";
import { CanvaDock } from "./canva-dock";
import { CanvaHotkeys } from "./canva-hotkeys";
import { CanvaSection, NewCanvaSection } from "./canva-section";

type CanvaEditorProps = {
  audit: ReturnType<typeof useAudit>;
};

export const CanvaEditor = ({ audit }: CanvaEditorProps) => {
  const pageIndex = useCanvaStore((state) => state.pageIndex);
  const currentPage = audit.data?.content?.pages[pageIndex];
  const addNewSection = useCanvaStore((state) => state.addNewSection);

  if (currentPage?.sections.length === 0) {
    return (
      <div className="flex size-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-secondary border-dashed p-10 text-muted-foreground [:has(button:hover)]:border-white">
          <p>No slides created yet</p>
          <Button
            className="h-auto flex-col"
            color="secondary"
            appearance="outline"
            onClick={() => {
              addNewSection();
            }}
          >
            <Add className="size-8" />
            Create Slide
          </Button>
        </div>
      </div>
    );
  }

  return (
    <QueryState query={audit}>
      <TransformWrapper
        initialScale={1}
        minScale={0.2}
        maxScale={8}
        limitToBounds={false}
        wheel={{
          excluded: ["no-scrolling"],
          activationKeys: ["Control", "Meta"],
        }}
        panning={{
          excluded: ["no-panning"],
        }}
        doubleClick={{
          disabled: true,
        }}
        onTransformed={(e) => {
          console.log(e, e.instance.transformState);
        }}
      >
        {({ setTransform, instance }) => {
          return (
            <div
              className="size-full overflow-hidden"
              onWheel={(e) => {
                // If activation key is pressed, let the library handle zoom
                if (e.ctrlKey || e.metaKey) return;
                // Otherwise, handle panning manually on scroll
                const { scale, positionX, positionY } = instance.transformState;
                const newX = positionX - e.deltaX;
                const newY = positionY - e.deltaY;
                setTransform(newX, newY, scale, 0);
              }}
            >
              <TransformComponent
                wrapperClass={cn(
                  "items-start! justify-center! flex-1 origin-center! overflow-hidden",
                )}
                contentClass={cn("flex-nowrap! origin-center!")}
                contentProps={{ id: "canva-content" }}
                wrapperStyle={
                  {
                    background:
                      "radial-gradient(circle, oklch(from var(--color-foreground) l c h / 0.1) 1px, transparent 1px) center / 20px 20px",
                    "--slot-height": "250px",
                    "--slot-width": "268px",
                  } as React.CSSProperties
                }
              >
                {/* Customizable horizontal dashed border that comes after the first image using SVG */}
                <svg
                  className="pointer-events-none absolute top-[calc(var(--slot-height)+2rem)] w-full overflow-visible"
                  fill="none"
                  aria-hidden="true"
                  height={2}
                >
                  <line
                    x1="-50000"
                    y1="100%"
                    x2="50000"
                    y2="100%"
                    strokeWidth="2"
                    strokeDasharray="10,10"
                    className="stroke-secondary"
                  />
                </svg>
                {currentPage?.sections?.map((section, index) => (
                  <CanvaSection
                    // biome-ignore lint/suspicious/noArrayIndexKey: index is used as a section identifier
                    key={index}
                    section={section}
                    sectionIndex={index}
                  />
                ))}
                <NewSections audit={audit} />
              </TransformComponent>
              <CanvaDock />
              <CanvaHotkeys />
            </div>
          );
        }}
      </TransformWrapper>
    </QueryState>
  );
};

const NewSections = ({ audit }: CanvaEditorProps) => {
  const newSections = useCanvaStore((state) => state.newSections);

  return newSections.map((section, _index) => (
    <NewCanvaSection key={section._id} />
  ));
};
