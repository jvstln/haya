import type { useHotkeys } from "react-hotkeys-hook";

type HotkeysParams = Parameters<typeof useHotkeys>;
type Key = HotkeysParams[0];
type HotkeyOptions = HotkeysParams[2];

type Hotkey = {
  label: string;
  keys: Key;
  shortcut: string;
  options?: HotkeyOptions;
};

/**
 * Static hotkey config for the Canva editor.
 * Reference by ID in both useHotkeys calls and UI labels/tooltips.
 */
export const canvaHotkeys = {
  zoomIn: { keys: ["plus", "equal"], label: "Zoom In", shortcut: "+" },
  zoomOut: { keys: ["minus"], label: "Zoom Out", shortcut: "-" },
  resetView: { keys: ["0"], label: "Reset View", shortcut: "0" },
  fitToScreen: { keys: ["f"], label: "Fit to Screen", shortcut: "F" },
} as const satisfies Record<string, Hotkey>;
