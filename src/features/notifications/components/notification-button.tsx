import { Notification } from "iconsax-reactjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNotifications } from "../notification.hook";

export const NotificationButton = (
  props: React.ComponentProps<typeof Button>,
) => {
  const unreadNotifications = useNotifications({ read: false });

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
        {(unreadNotifications.data?.notifications.length || 0) > 0 && (
          <span className="-translate-x-1/2 pointer-events-none absolute bottom-full left-full flex size-5 translate-y-1/2 items-center justify-center rounded-full bg-primary p-0.5 text-xxs">
            {Math.min(unreadNotifications.data?.notifications.length || 0, 999)}
          </span>
        )}
        <Notification />
      </Link>
    </Button>
  );
};
