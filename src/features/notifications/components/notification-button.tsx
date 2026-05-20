import { Notification } from "iconsax-reactjs";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import { useNotifications } from "../notification.hook";
import type { NotificationFilters } from "../notification.type";

export const NotificationButton = (props: Partial<Button.LinkButtonProps>) => {
  // filters passed to useNotifications to try preventing unnecessary refetching of notifications
  const { filters } = useFilters<NotificationFilters>();
  const notifications = useNotifications(filters);

  return (
    <Button
      href="/dashboard/notifications"
      appearance="outline"
      color="secondary"
      size="icon"
      {...props}
      className={cn("relative", props.className)}
    >
      {/* Unread indicator */}
      {(notifications.data?.unreadCount || 0) > 0 && (
        <span className="-translate-x-1/2 pointer-events-none absolute bottom-full left-full flex size-5 translate-y-1/2 items-center justify-center rounded-full bg-primary p-0.5 text-xxs">
          {Math.min(notifications.data?.unreadCount || 0, 999)}
        </span>
      )}
      <Notification />
    </Button>
  );
};
