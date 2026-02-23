import { api } from "@/lib/api";
import type { Pagination } from "@/types/type";
import type { Notification, NotificationFilters } from "./notification.type";

async function getNotifications(params: NotificationFilters) {
  const response = await api.get<{
    data: {
      notifications: Notification[];
      pagination: Pagination;
      unreadCount: number;
    };
  }>("/teams/notifications", { params });
  return response.data.data;
}

async function markAllNotificationsAsRead() {
  const response = await api.patch("/teams/notifications/read-all");
  return response.data;
}

async function markNotificationAsRead(notificationId: string) {
  const response = await api.patch(
    `/teams/notifications/${notificationId}/read`,
  );
  return response.data;
}

export { getNotifications, markAllNotificationsAsRead, markNotificationAsRead };
