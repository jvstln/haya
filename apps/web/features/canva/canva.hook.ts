import { useMutation } from "@tanstack/react-query";
import { useControls } from "react-zoom-pan-pinch";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api";
import * as CanvaService from "./canva.service";

export function useCanvaControls() {
  const {
    setTransform,
    instance,
    zoomIn: _zoomIn,
    zoomOut: _zoomOut,
    resetTransform,
  } = useControls();

  // const zoomIn = (scale = 0.1) => {
  //   if (!instance.contentComponent) return;

  //   const currentScale = instance.transformState.scale;
  //   const currentWidth = instance.contentComponent.offsetWidth;
  //   const currentHeight = instance.contentComponent.offsetHeight;
  //   const newScale = currentScale + scale;
  //   const newWidth = (currentWidth * newScale) / currentScale;
  //   const newHeight = (currentHeight * newScale) / currentScale;

  //   const deltaWidth = currentWidth - newWidth;
  //   const deltaHeight = currentHeight - newHeight;

  //   setTransform(
  //     instance.transformState.positionX - deltaWidth / 2,
  //     instance.transformState.positionY - deltaHeight / 2,
  //     newScale,
  //   );
  // };

  // const zoomOut = (scale = 0.1) => {
  //   if (!instance.contentComponent) return;

  //   const currentScale = instance.transformState.scale;
  //   const currentWidth = instance.contentComponent.offsetWidth;
  //   const currentHeight = instance.contentComponent.offsetHeight;
  //   const newScale = currentScale - scale;
  //   const newWidth = (currentWidth * newScale) / currentScale;
  //   const newHeight = (currentHeight * newScale) / currentScale;

  //   const deltaWidth = currentWidth - newWidth;
  //   const deltaHeight = currentHeight - newHeight;

  //   setTransform(
  //     instance.transformState.positionX - deltaWidth / 2,
  //     instance.transformState.positionY - deltaHeight / 2,
  //     newScale,
  //   );
  // };

  const fitElementToScreen = (
    element: HTMLElement | null = instance.contentComponent,
    padding = 40,
  ) => {
    const wrapper = instance.wrapperComponent;
    if (!element || !wrapper) return;

    // offsetWidth/offsetHeight are not affected by CSS transforms, so they're already unscaled
    const elWidth = element.offsetWidth;
    const elHeight = element.offsetHeight;

    // Available space in the wrapper minus padding on each side
    const availWidth = wrapper.offsetWidth - padding * 2;
    const availHeight = wrapper.offsetHeight - padding * 2;

    // Scale to fit all content within the available space
    const newScale = Math.min(availWidth / elWidth, availHeight / elHeight);

    // Center the element within the wrapper
    const newPosX = (wrapper.offsetWidth - elWidth * newScale) / 2;
    const newPosY = (wrapper.offsetHeight - elHeight * newScale) / 2;

    setTransform(newPosX, newPosY, newScale);
  };

  return {
    zoomIn: _zoomIn,
    zoomOut: _zoomOut,
    instance,
    setTransform,
    resetTransform,
    fitElementToScreen,
  };
}

export const useCreateSection = () => {
  return useMutation({
    mutationFn: CanvaService.createSection,
    onMutate: () => {
      toast.loading("Initializing section...", { id: "createSection" });
    },
    onSuccess: () => {
      toast.success("Section created successfully", {
        id: "createSection",
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) ?? "Failed to create section", {
        id: "createSection",
      });
    },
  });
};

export const useAnalyzeSectionImage = () => {
  return useMutation({
    mutationFn: CanvaService.analyzeSectionImage,
    onMutate: () => {
      toast.loading("Running analysis...", { id: "analyzeSectionImage" });
    },
    onSuccess: () => {
      toast.success("Analysis completed successfully", {
        id: "analyzeSectionImage",
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) ?? "Failed to analze", {
        id: "analyzeSectionImage",
      });
    },
  });
};
