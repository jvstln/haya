"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
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
  // Handle controlled and uncontrolled open state
  const [_open, _setOpen] = useState(props.defaultOpen);
  const open = props.open ?? _open;
  const setOpen = (open: boolean) => {
    props.onOpenChange?.(open);
    _setOpen(open);
  };

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
          setOpen(false);
          setRespondingAction(null);
        },
        onSettled: () => {
          setRespondingAction(null);
        },
      },
    );
  };

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
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
