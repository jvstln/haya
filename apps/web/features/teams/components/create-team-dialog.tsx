import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import type { User } from "@/features/users/user.type";
import { useCreateTeam } from "../team.hook";
import { newTeamSchema } from "../team.schema";
import type { NewTeam, NewTeamInput } from "../team.type";
import { TeamMemberSelect } from "./team-member-select";

type CreateTeamDialogProps = React.ComponentProps<typeof Dialog> & {};

export const CreateTeamDialog = ({
  children,
  ...props
}: CreateTeamDialogProps) => {
  // Handled controlled and uncontrolled open state
  const [_open, _setOpen] = useState(props.defaultOpen ?? false);
  const open = props.open ?? _open;
  const setOpen = (open: boolean) => {
    _setOpen(open);
    props.onOpenChange?.(open);
  };

  const createTeam = useCreateTeam();

  const form = useForm<NewTeamInput, unknown, NewTeam>({
    defaultValues: {
      name: "",
      memberUsernames: [],
    },
    resolver: zodResolver(newTeamSchema),
  });

  const membersField = useFieldArray({
    name: "memberUsernames",
    control: form.control,
  });

  const handleSubmit = (values: NewTeam) => {
    createTeam.mutate(values, {
      onSuccess() {
        form.reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md" closeButton={false}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
            <DialogDescription>
              Create a team of experts to validate AI insights and maximize
              growth
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  placeholder="your team name"
                  className="border-0 bg-secondary/50"
                  {...form.register("name")}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="teamMemberSelect">Add Members</FieldLabel>
                <TeamMemberSelect
                  selectedUsers={membersField.fields as unknown as User[]}
                  onUserAdd={(user) => membersField.append(user)}
                  onUserRemove={(user) => {
                    const index = membersField.fields.findIndex(
                      (m) => m._id === user._id,
                    );
                    if (index !== -1) membersField.remove(index);
                  }}
                />
              </Field>
            </FieldGroup>
          </div>
          <DialogFooter className="*:flex-1">
            <Button size="lg" isLoading={createTeam.isPending}>
              Create Team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
