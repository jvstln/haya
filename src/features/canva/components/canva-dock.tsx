import { ArrowDown2, DocumentUpload } from "iconsax-reactjs";
import {
  CircleQuestionMarkIcon,
  ScanSearch,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { useAuth } from "@/features/auth/auth.hook";
import { getInitials } from "@/lib/utils";
import { useCanvaControls } from "../canva.hook";
import { canvaHotkeys } from "../canva.hotkeys";
import { useCanvaStore } from "../canva.store";

export const CanvaDock = () => {
  const auth = useAuth();
  const { zoomIn, zoomOut, instance, fitElementToScreen, resetTransform } =
    useCanvaControls();
  const addEmptySection = useCanvaStore((state) => state.addEmptySection);

  return (
    <div className="-translate-1/2 fixed bottom-5 left-1/2 flex h-14 w-fit items-center gap-4 rounded-full border border-secondary bg-muted px-5 py-2.5">
      <div className="flex items-center gap-1">
        <Avatar>
          <AvatarFallback>
            {getInitials(auth.user?.username ?? "")}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm">@{auth.user?.username}</span>
      </div>

      <Button
        color="secondary"
        className="rounded-full"
        onClick={addEmptySection}
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
            {canvaHotkeys.zoomIn.label}
            <DropdownMenuShortcut>
              <Kbd>{canvaHotkeys.zoomIn.shortcut}</Kbd>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => zoomOut()}>
            <ZoomOut />
            {canvaHotkeys.zoomOut.label}
            <DropdownMenuShortcut>
              <Kbd>{canvaHotkeys.zoomOut.shortcut}</Kbd>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fitElementToScreen()}>
            <ScanSearch />
            {canvaHotkeys.fitToScreen.label}
            <DropdownMenuShortcut>
              <Kbd>{canvaHotkeys.fitToScreen.shortcut}</Kbd>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => resetTransform()}>
            <ScanSearch />
            {canvaHotkeys.resetView.label}
            <DropdownMenuShortcut>
              <Kbd>{canvaHotkeys.resetView.shortcut}</Kbd>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>

        <Button
          color="secondary"
          className="rounded-full"
          onClick={() => {
            console.log(instance, instance.transformState);
          }}
        >
          <CircleQuestionMarkIcon />
        </Button>
      </DropdownMenu>
    </div>
  );
};
