"use client";

import { Add } from "iconsax-reactjs";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { QueryState } from "@/components/query-states";
import { Button } from "@workspace/ui/components/button";
import { useAudit } from "@/features/audits/audit.hook";
import { cn } from "@/lib/utils";
import { useCanvaStore } from "../canva.store";
import { CanvaDock } from "./canva-dock";
import { CanvaHotkeys } from "./canva-hotkeys";
import {
  AuditCanvaSection,
  CustomCanvaSection,
  EmptyCanvaSection,
} from "./canva-section";

export const CanvaEditor = () => {
  const pathname = usePathname();
  const auditId = useCanvaStore((state) => state.auditId);

  const currentPage = useCanvaStore((state) => state.currentPage);
  const customSections = useCanvaStore((state) => state.customSections);
  const emptySectionsCount = useCanvaStore((state) => state.emptySectionsCount);

  const addEmptySection = useCanvaStore((state) => state.addEmptySection);
  const setCurrentPage = useCanvaStore((state) => state.setCurrentPage);
  const addCustomSection = useCanvaStore((state) => state.addCustomSection);

  const audit = useAudit(auditId ?? "");

  // Set the current page to the first page of the audit if it exists
  useEffect(() => {
    if (audit.data && !currentPage) {
      setCurrentPage(audit.data.content?.pages[0]);
    }
  }, [audit.data, currentPage, setCurrentPage]);

  // Initialize custom sections
  useEffect(() => {
    if (
      customSections.length === 0 &&
      audit.data?.customSections &&
      audit.data?.customSections.length !== 0
    ) {
      addCustomSection(audit.data.customSections);
    }
  }, [audit.data, customSections, addCustomSection]);

  if (
    (currentPage?.sections || []).length === 0 &&
    customSections.length === 0 &&
    emptySectionsCount === 0 &&
    !pathname.endsWith("/new")
  ) {
    return (
      <div className="flex size-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-secondary border-dashed p-10 text-muted-foreground [:has(button:hover)]:border-white">
          <p>No slides created yet</p>
          <Button
            className="h-auto flex-col"
            color="secondary"
            appearance="outline"
            onClick={() => {
              addEmptySection();
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
    <QueryState
      query={{
        ...audit,
        isPending: audit.isPending && !pathname.endsWith("/new"),
      }}
    >
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
                  "items-start! justify-center! min-w-full flex-1 origin-center! overflow-hidden",
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
                {/* There are 3 types of sections: */}
                {/* 1. Audit sections - from the initial analyzed audit */}
                {/* 2. Custom sections - added by the user */}
                {/* 3. Empty sections - placeholders for new sections */}

                <AuditSections />
                <CustomSections />
                <EmptySections />
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

const AuditSections = () => {
  const currentPage = useCanvaStore((state) => state.currentPage);

  return currentPage?.sections?.map((section, index) => (
    <AuditCanvaSection
      // biome-ignore lint/suspicious/noArrayIndexKey: index is used as a section identifier
      key={index}
      section={section}
      sectionIndex={index}
    />
  ));
};

const CustomSections = () => {
  const customSections = useCanvaStore((state) => state.customSections);

  return customSections.map((section, _index) => (
    <CustomCanvaSection key={section._id} section={section} />
  ));
};

const EmptySections = () => {
  const emptySectionsCount = useCanvaStore((state) => state.emptySectionsCount);

  return Array.from({ length: emptySectionsCount }).map((index) => (
    <EmptyCanvaSection key={`empty-${index}`} />
  ));
};
