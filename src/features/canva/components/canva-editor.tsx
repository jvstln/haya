import { Add, ArrowDown2, DocumentUpload } from "iconsax-reactjs";
import { ScanSearch, ZoomIn, ZoomOut } from "lucide-react";
import type React from "react";
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from "react-zoom-pan-pinch";
import { QueryState } from "@/components/query-states";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { useCanvaEditor } from "../canva.hook";
import { CanvaSection } from "./canva-section";
import { useStore } from "zustand";

export const CanvaEditor = ({
  canvaEditor,
}: {
  canvaEditor: ReturnType<typeof useCanvaEditor>;
}) => {
  const sections = useStore(canvaEditor.editor, (state) => state.sections);
  const actions = useStore(canvaEditor.editor, (state) => state.actions);

  if (sections.length === 0) {
    return (
      <div className="flex size-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-secondary border-dashed p-10 text-muted-foreground [:has(button:hover)]:border-white">
          <p>No slides created yet</p>
          <Button
            className="h-auto flex-col"
            color="secondary"
            appearance="outline"
            onClick={() => {
              actions.addSection();
            }}
          >
            <Add className="size-8" />
            Create Slide
          </Button>
        </div>
      </div>
    );
  }

  return canvaEditor.isPending ? (
    <QueryState query={canvaEditor} />
  ) : (
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
              wrapperClass={cn("size-full! flex-1 overflow-hidden")}
              contentClass={cn("flex h-full! w-full! items-start flex-nowrap")}
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
              {sections?.map((section) => (
                <CanvaSection key={section._id} section={section} />
              ))}
            </TransformComponent>
            <CanvaDock canvaEditor={canvaEditor} />
          </div>
        );
      }}
    </TransformWrapper>
  );
};

export const CanvaDock = ({
  canvaEditor,
}: {
  canvaEditor: ReturnType<typeof useCanvaEditor>;
}) => {
  const { resetTransform, zoomIn, zoomOut } = useControls();

  return (
    <div className="-translate-1/2 absolute bottom-5 left-1/2 flex h-14 w-fit items-center gap-4 rounded-full border border-secondary bg-muted px-5 py-2.5">
      <div className="flex items-center gap-1">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-sm">@emerie</span>
      </div>

      <Button
        color="secondary"
        className="rounded-full"
        onClick={() => canvaEditor.editor.getState().actions.addSection()}
      >
        <DocumentUpload className="size-5.5 rounded-sm bg-primary p-1" />
        New Slide
      </Button>

      {/* Zoom dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button color="secondary" className="rounded-full">
            <ZoomIn />
            <ArrowDown2 />
            <span className="sr-only">Zoom</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => zoomIn()}>
            <ZoomIn />
            Zoom In
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => zoomOut()}>
            <ZoomOut />
            Zoom Out
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => resetTransform()}>
            <ScanSearch />
            Reset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
