import { useHotkeys } from "react-hotkeys-hook";
import { useCanvaControls } from "../canva.hook";
import { canvaHotkeys } from "../canva.hotkeys";

export const CanvaHotkeys = () => {
  const { zoomIn, zoomOut, resetTransform, fitElementToScreen } =
    useCanvaControls();

  useHotkeys(canvaHotkeys.zoomIn.keys, () => zoomIn());
  useHotkeys(canvaHotkeys.zoomOut.keys, () => zoomOut());
  useHotkeys(canvaHotkeys.resetView.keys, () => resetTransform());
  useHotkeys(canvaHotkeys.fitToScreen.keys, () => fitElementToScreen());

  return null;
};
