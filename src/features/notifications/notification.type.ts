import type { QueryParams } from "@/types/type";

export type NotificationFilters = QueryParams & {
  read?: boolean;
};

export type NotificationType = "team_invite";

export type Notification = {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  updatedAt: string;

  metadata: Partial<{
    teamId: string;
    teamName: string;
    inviterId: string;
  }>;
};
