import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryclient";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notification.service";
import type { NotificationFilters } from "./notification.type";

export function useNotifications(filters: NotificationFilters = {}) {
  return useQuery({
    queryKey: ["notifications", filters],
    queryFn: async () => getNotifications(filters),
  });
}

export function useMarkAllNotificationsAsRead() {
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      toast.success("All notifications marked as read");
      invalidateNotificationQueries();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark notifications as read");
    },
  });
}

export function useMarkNotificationAsRead() {
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      invalidateNotificationQueries();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark notification as read");
    },
  });
}

export function invalidateNotificationQueries() {
  ["notifications"].map((key) =>
    queryClient.invalidateQueries({
      queryKey: [key],
    }),
  );
}
