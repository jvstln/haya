"use client";
import { formatDistanceToNow } from "date-fns";
import {
  DashboardHeader,
  GradientBackground,
} from "@/components/dashboard-header";
import { FolderIcon } from "@/components/icons";
import { QueryState } from "@/components/query-states";
import { Button } from "@/components/ui/button";
import { InputSearch } from "@/components/ui/input-search";
import { useFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "../notification.hook";
import type { Notification } from "../notification.type";

const NotificationItem = ({
  notification,
  onMarkAsRead,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}) => {
  return (
    // biome-ignore lint/a11y/useSemanticElements: Using button might cause hydration error
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        if (!notification.read) {
          onMarkAsRead(notification._id);
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !notification.read) {
          onMarkAsRead(notification._id);
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

export const NotificationsPage = () => {
  const { filters, setFilters, originalFilters } = useFilters();

  const notifications = useNotifications(filters);
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const markAsRead = useMarkNotificationAsRead();

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-6 p-3 md:p-6">
      <GradientBackground />
      <DashboardHeader
        title="Stay updated with your latest notifications"
        cta={
          <Button
            className="animate-border-glow rounded-full"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            Mark all as read
          </Button>
        }
      />

      <div className="flex items-center justify-end">
        <InputSearch
          placeholder="Search notifications"
          value={originalFilters.search}
          onChange={(e) => {
            setFilters((f) => ({ ...f, search: e.target.value }));
          }}
        />
      </div>

      {notifications.data && notifications.data.notifications.length === 0 && (
        <div className="flex grow flex-col items-center justify-center text-sm">
          <FolderIcon className="size-40" />
          <p>No notifications yet</p>
        </div>
      )}

      <QueryState
        query={notifications}
        errorPrefix="Error fetching notifications"
      >
        <div className="flex flex-col gap-3">
          {notifications.data?.notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={(id) => markAsRead.mutate(id)}
            />
          ))}
        </div>
      </QueryState>
    </div>
  );
};
