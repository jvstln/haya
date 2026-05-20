import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { User } from "@/features/users/user.type";
import { useCreateTeam } from "../team.hook";
import { newTeamSchema } from "../team.schema";
import type { NewTeam, NewTeamInput } from "../team.type";
import { TeamMemberSelect } from "./team-member-select";

type CreateTeamDialogProps = React.ComponentProps<typeof Dialog> & {
  children?: React.ReactElement;
};

export const CreateTeamDialog = ({
  children,
  ...props
}: CreateTeamDialogProps) => {
  const [dialogHandle] = useState(createDialogHandle);

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
        dialogHandle.close();
      },
    });
  };

  return (
    <Dialog handle={dialogHandle} {...props}>
      {children && <DialogTrigger render={children} />}
      <DialogContent closeButton={false}>
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
