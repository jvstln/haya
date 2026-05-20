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
  DialogTrigger,
} from "@/components/ui/dialog";
import type { User } from "@/features/users/user.type";
import { useInviteUserToTeam } from "../team.hook";
import { TeamMemberSelect } from "./team-member-select";

type AddTeamMemberDialogProps = React.ComponentProps<typeof Dialog> & {
  teamId: string;
  children?: React.ReactElement;
};

export const AddTeamMemberDialog = ({
  teamId,
  children,
  ...props
}: AddTeamMemberDialogProps) => {
  const [dialogHandle] = useState(createDialogHandle);

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const inviteUser = useInviteUserToTeam();

  const handleAddMember = async () => {
    await Promise.all(
      selectedUsers.map((user) =>
        inviteUser.mutateAsync({ teamId, username: user.username }),
      ),
    );
    setSelectedUsers([]);
    dialogHandle.close();
  };

  return (
    <Dialog handle={dialogHandle} {...props}>
      {children && <DialogTrigger render={children} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Add a member to review, refine, and strengthen every AI audit.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <TeamMemberSelect
            selectedUsers={selectedUsers}
            onUserAdd={(user) => setSelectedUsers((prev) => [...prev, user])}
            onUserRemove={(user) =>
              setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id))
            }
          />
        </div>

        <DialogFooter className="*:flex-1">
          <Button
            size="lg"
            onClick={handleAddMember}
            color="primary"
            isLoading={inviteUser.isPending}
            disabled={selectedUsers.length === 0}
          >
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
