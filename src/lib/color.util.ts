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

/**
 * Status alias groups — each theme color maps to all the status
 * strings that should resolve to it. To add a new alias, just
 * append a string to the relevant array.
 */
const statusColorGroups = {
  success: [
    "success",
    "ok",
    "okay",
    "ready",
    "active",
    "completed",
    "done",
    "passed",
    "healthy",
    "up",
    "online",
    "enabled",
    "approved",
    "resolved",
    "verified",
    "valid",
    "finished",
    "successful",
    "correct",
    "live",
  ],
  destructive: [
    "error",
    "failed",
    "failure",
    "critical",
    "danger",
    "fatal",
    "blocked",
    "rejected",
    "denied",
    "down",
    "offline",
    "disabled",
    "invalid",
    "cancelled",
    "canceled",
    "stopped",
  ],
  warning: [
    "warning",
    "warn",
    "caution",
    "high",
    "degraded",
    "slow",
    "expiring",
    "pending-review",
    "paused",
    "suspended",
  ],
  info: [
    "info",
    "information",
    "notice",
    "medium",
    "in-progress",
    "processing",
    "syncing",
    "updating",
    "running",
    "ongoing",
    "loading",
    "loaded",
  ],
  primary: [
    "primary",
    "default",
    "pending",
    "new",
    "draft",
    "idle",
    "start",
    "started",
    "initialized",
    "queued",
    "scheduled",
  ],
  secondary: [
    "secondary",
    "inactive",
    "archived",
    "muted",
    "low",
    "unknown",
    "none",
  ],
  colorful: ["premium"],
} as const satisfies Record<ThemeColor, string[]>;
type ColorStatusAlias =
  (typeof statusColorGroups)[keyof typeof statusColorGroups][number];
const statusColorGroupsEntries = Object.entries(statusColorGroups) as Array<
  [keyof typeof statusColorGroups, ColorStatusAlias[]]
>;

/**
 * Resolves a status string to a theme color.
 * Input is normalized (trimmed, lowercased, separators stripped).
 */
export function getStatusColor(
  status: ColorStatusAlias | string | null | undefined,
  fallback: ThemeColor = "secondary",
): ThemeColor {
  if (!status) return fallback;

  const matchedAlias = statusColorGroupsEntries.find(([_, aliases]) => {
    return aliases.some((alias) =>
      status
        .toLowerCase()
        .replace(/[\s_-]+/g, "-")
        .includes(alias),
    );
  });

  return matchedAlias?.[0] ?? fallback;
}

export function stringToColor(str: string) {
  return `hsl(${stringToHashedNumber(str) % 360}, 70%, 60%)`;
}
