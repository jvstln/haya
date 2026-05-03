import { formatDistanceToNow } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";
import type { Notification } from "../notification.type";

export const NotificationItem = ({
  notification,
  onSelect,
}: {
  notification: Notification;
  onSelect?: (notification: Notification) => void;
}) => {
  return (
    // biome-ignore lint/a11y/useSemanticElements: Using button might cause hydration error
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        onSelect?.(notification);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect?.(notification);
        }
      }}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
        notification.read
          ? "border-border bg-card"
          : "border-primary/30 bg-primary/5",
      )}
    >
      <div
        className={cn(
          "mt-1.5 size-2.5 shrink-0 rounded-full",
          notification.read ? "bg-muted" : "bg-primary",
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          className={cn(
            "text-body-4",
            notification.read
              ? "text-muted-foreground"
              : "font-semibold text-white",
          )}
        >
          {notification.title}
        </span>
        <p className="text-muted-foreground text-xs">{notification.message}</p>
        <span className="text-muted-foreground text-xxs">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>
  );
};
