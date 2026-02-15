"use client";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { QueryState } from "@/components/query-states";
import { useCanvaEdits } from "../canva.hook";
import { CanvaSection } from "./canva-section";

export const CanvaPage = () => {
  const edits = useCanvaEdits();

  return (
    <TransformWrapper>
      <TransformComponent
        wrapperClass="flex-1 !w-full"
        contentClass="!w-full flex items-start"
        wrapperStyle={
          {
            background: `
          linear-gradient(to right, oklch(from var(--color-secondary) l c h / 0.5) 1px, transparent 1px) center / 10px 100%,
          linear-gradient(to bottom, oklch(from var(--color-secondary) l c h / 0.5) 1px, transparent 1px) center / 100% 10px`,
            "--slot-height": "200px",
            "--slot-width": "268px",
          } as React.CSSProperties
        }
      >
        {/* Customizable horizontal dashed border that comes after the first image using SVG */}
        <svg
          className="pointer-events-none absolute top-[calc(var(--slot-height))] w-full overflow-visible"
          fill="none"
          aria-hidden="true"
          height={2}
        >
          <line
            x1="0%"
            y1="100%"
            x2="100%"
            y2="100%"
            strokeWidth="2"
            strokeDasharray="10,10"
            className="stroke-secondary"
          />
        </svg>
        <QueryState query={edits}>
          {edits.data?.map((section) => (
            <CanvaSection key={section.category} section={section} />
          ))}
        </QueryState>
      </TransformComponent>
    </TransformWrapper>
  );
};
