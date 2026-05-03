import { Notification } from "iconsax-reactjs";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { useFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import { useNotifications } from "../notification.hook";
import type { NotificationFilters } from "../notification.type";

export const NotificationButton = (
  props: React.ComponentProps<typeof Button>,
) => {
  // filters passed to useNotifications to try preventing unnecessary refetching of notifications
  const { filters } = useFilters<NotificationFilters>();
  const notifications = useNotifications(filters);

  return (
    <Button
      appearance="outline"
      color="secondary"
      size="icon"
      asChild
      {...props}
      className={cn("relative", props.className)}
    >
      <Link href="/dashboard/notifications">
        {/* Unread indicator */}
        {(notifications.data?.unreadCount || 0) > 0 && (
          <span className="-translate-x-1/2 pointer-events-none absolute bottom-full left-full flex size-5 translate-y-1/2 items-center justify-center rounded-full bg-primary p-0.5 text-xxs">
            {Math.min(notifications.data?.unreadCount || 0, 999)}
          </span>
        )}
        <Notification />
      </Link>
    </Button>
  );
};
