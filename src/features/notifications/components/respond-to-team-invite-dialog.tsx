"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  createDialogHandle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRespondToTeamInvite } from "@/features/teams/team.hook";
import type { Notification } from "../notification.type";

type RespondToTeamInviteDialogProps = React.ComponentProps<typeof Dialog> & {
  notification: Notification | null;
};

export const RespondToTeamInviteDialog = ({
  notification,
  ...props
}: RespondToTeamInviteDialogProps) => {
  const [dialogHandle] = useState(createDialogHandle);

  const router = useRouter();

  const respondToInvite = useRespondToTeamInvite();
  const [respondingAction, setRespondingAction] = useState<
    "accept" | "reject" | null
  >(null);

  const teamId = notification?.metadata?.teamId;
  const teamName = notification?.metadata?.teamName;

  const handleRespond = (action: "accept" | "reject") => {
    if (!teamId) return;

    setRespondingAction(action);
    respondToInvite.mutate(
      { teamId, action },
      {
        onSuccess: () => {
          dialogHandle.close();
          setRespondingAction(null);
          if (action === "accept") {
            router.push(`/dashboard/teams?teamId=${teamId}`);
          }
        },
        onSettled: () => {
          setRespondingAction(null);
        },
      },
    );
  };

  return (
    <Dialog handle={dialogHandle} {...props}>
      <DialogContent closeButton={false}>
        <DialogHeader className="items-center">
          <DialogTitle>{notification?.title || "Team Invitation"}</DialogTitle>
          <DialogDescription>
            {notification?.message ||
              `You've been invited to join ${teamName ?? "a team"}.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="*:flex-1">
          <Button
            appearance="outline"
            color="secondary"
            size="lg"
            onClick={() => handleRespond("reject")}
            disabled={respondToInvite.isPending}
            isLoading={respondingAction === "reject"}
          >
            Decline
          </Button>
          <Button
            size="lg"
            onClick={() => handleRespond("accept")}
            disabled={respondToInvite.isPending}
            isLoading={respondingAction === "accept"}
          >
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
