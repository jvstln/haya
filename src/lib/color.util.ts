import { stringToHashedNumber } from "./utils";

export const themeColors = {
  primary: "[--bg:var(--color-primary)] [--fg:var(--color-primary-foreground)]",
  secondary:
    "[--bg:var(--color-secondary)] [--fg:var(--color-secondary-foreground)]",
  destructive:
    "[--bg:var(--color-destructive)] [--fg:var(--color-destructive-foreground)]",
  success: "[--bg:var(--color-success)] [--fg:var(--color-success-foreground)]",
  warning: "[--bg:#f97316] [--fg:var(--color-white)]", // orange-500
  info: "[--bg:var(--color-cyan)] [--fg:var(--color-white)]", // cyan
  colorful:
    "bg-(image:--bg) [--bg:var(--colorful-gradient)] [--fg:var(--color-white)]",
} as const;

export type ThemeColor = keyof typeof themeColors;

export function stringToColor(str: string) {
  return `hsl(${stringToHashedNumber(str) % 360}, 70%, 60%)`;
}
