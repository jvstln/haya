"use client";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { FolderIcon } from "@/components/icons";
import { QueryState } from "@/components/query-states";
import { Button } from "@/components/ui/button";
import { InputSearch } from "@/components/ui/input-search";
import { useFilters } from "@/hooks/use-filters";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "../notification.hook";
import type { Notification, NotificationFilters } from "../notification.type";
import { NotificationItem } from "./notification-item";
import { RespondToTeamInviteDialog } from "./respond-to-team-invite-dialog";

export const NotificationsPage = () => {
  const { filters, setFilters, originalFilters } =
    useFilters<NotificationFilters>();
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const notifications = useNotifications(filters);
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const markAsRead = useMarkNotificationAsRead();

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-6 p-3 md:p-6">
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

      <div className="flex items-center justify-end gap-1">
        <Button
          appearance={
            filters.status === "all" || !filters.status ? "solid" : "ghost"
          }
          color="secondary"
          size="sm"
          onClick={() => setFilters(({ status, ...f }) => f)}
        >
          All
        </Button>
        <Button
          appearance={filters.status === "unread" ? "solid" : "ghost"}
          color="secondary"
          size="sm"
          onClick={() => setFilters((f) => ({ ...f, status: "unread" }))}
        >
          Unread
        </Button>
        <Button
          appearance={filters.status === "read" ? "solid" : "ghost"}
          color="secondary"
          size="sm"
          onClick={() => setFilters((f) => ({ ...f, status: "read" }))}
        >
          Read
        </Button>

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
              onSelect={(notification) => {
                setSelectedNotification(notification);
                if (!notification.read) {
                  markAsRead.mutate(notification._id);
                }
              }}
            />
          ))}
        </div>
      </QueryState>

      <RespondToTeamInviteDialog
        notification={selectedNotification}
        open={selectedNotification?.type === "team_invite"}
        onOpenChange={(open) => {
          if (!open) setSelectedNotification(null);
        }}
      />
    </div>
  );
};
