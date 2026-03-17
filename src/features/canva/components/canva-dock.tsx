import { ArrowDown2, DocumentUpload } from "iconsax-reactjs";
import { ScanSearch, ZoomIn, ZoomOut } from "lucide-react";
import { useControls } from "react-zoom-pan-pinch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/auth.hook";
import { getInitials } from "@/lib/utils";

export const CanvaDock = () => {
  const auth = useAuth();
  const { setTransform, centerView, zoomIn, zoomOut, instance } = useControls();

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
        // onClick={() => canvaEditor.editor.getState().actions.addSection()}
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
          <DropdownMenuItem
            onClick={() => {
              const wrapper = instance.wrapperComponent;
              const content = instance.contentComponent;
              if (wrapper && content) {
                const padding = 80;
                const scaleX =
                  wrapper.offsetWidth / (content.scrollWidth + padding);
                const scaleY =
                  wrapper.offsetHeight / (content.scrollHeight + padding);
                // Max scale of 1 means we don't zoom in automatically if the content is small
                const scale = Math.min(scaleX, scaleY, 1);
                centerView(scale);
              }
            }}
          >
            <ScanSearch />
            Fit to Screen
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTransform(0, 0, 1)}>
            <ScanSearch />
            Reset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
