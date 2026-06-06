import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";

/**
 * Formats a seconds value into a compact human-readable duration.
 * @example formatDuration(125) → "2m 5s"
 * @example formatDuration(45)  → "45s"
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

/**
 * Formats milliseconds into a mm:ss timestamp string.
 * Useful for media player / replay timelines.
 * @example formatTimestamp(90500) → "01:30"
 */
export function formatTimestamp(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Formats a date value into a locale-friendly short datetime.
 * @example formatShortDateTime("2025-06-01T12:30:00Z") → "Jun 1, 12:30 PM"
 */
export function formatShortDateTime(
  date: string | number | Date,
  locale = "en-US",
): string {
  return new Date(date).toLocaleString(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Wraps `date-fns/formatDistanceToNow` with `addSuffix: true` by default.
 * @example timeAgo("2025-06-01T12:30:00Z") → "3 days ago"
 */
export function timeAgo(
  date: string | number | Date,
  options?: Parameters<typeof formatDistanceToNow>[1],
): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    ...options,
  });
}

/**
 * Returns a strict human-readable distance for a duration given in seconds.
 * @example formatDurationStrict(125) → "2 minutes"
 */
export function formatDurationStrict(seconds: number): string {
  return formatDistanceToNowStrict(Date.now() + seconds * 1000);
}

/**
 * Formats a relative timestamp (in milliseconds) into a +m:ss format.
 * @example formatRelativeTime(125000) → "+2:05"
 */
export function formatRelativeTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `+${minutes}:${String(seconds).padStart(2, "0")}`;
}

