"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown2 } from "iconsax-reactjs";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "@workspace/ui/components/sonner";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Button, IconToggleButton } from "@workspace/ui/components/button";
import { Field, FieldError } from "@workspace/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@workspace/ui/components/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { getInitials } from "@/lib/utils";
import { messageTeamMembersSchema } from "../team.schema";
import type {
  MessageTeamMembers,
  MessageTeamMembersInput,
  Team,
} from "../team.type";

export function MessageTeamMembersForm({ team }: { team: Team }) {
  const form = useForm<MessageTeamMembersInput, unknown, MessageTeamMembers>({
    defaultValues: {
      message: "",
      members: [],
    },
    resolver: zodResolver(messageTeamMembersSchema),
  });

  const membersField = useFieldArray({
    name: "members",
    control: form.control,
  });

  const handleSubmit = (values: MessageTeamMembers) => {
    console.log(values);
    toast("Feature coming soon");
    form.reset();
  };

  const errors = Object.values(form.formState.errors);

  return (
    <form onSubmit={() => form.handleSubmit(handleSubmit)}>
      <Field data-invalid={errors.length > 0}>
        <InputGroup className="bg-background">
          <InputGroupTextarea
            placeholder="Send team message..."
            {...form.register("message")}
            aria-invalid={errors.length > 0}
          />
          <InputGroupAddon className="border-t" align="block-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  className="ml-auto"
                  appearance="outline"
                  color="secondary"
                >
                  Send to
                  {membersField.fields.length > 0 && (
                    <span className="relative flex">
                      {membersField.fields.map((member) => (
                        <Avatar
                          key={member.id}
                          className="not-first:-ml-3.5 size-4.5"
                        >
                          <AvatarFallback>
                            {getInitials(member.username)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </span>
                  )}
                  <ArrowDown2 />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex w-64 flex-col p-1" align="end">
                {team.members.map((member) => {
                  const isSelected = membersField.fields.some(
                    (field) => field._id === member._id,
                  );

                  return (
                    <div
                      key={member._id}
                      className="relative flex items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarFallback>
                            {getInitials(member.username)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {member.username}
                        </span>
                      </div>
                      <IconToggleButton
                        isActive={isSelected}
                        onClick={() => {
                          if (isSelected) {
                            membersField.remove(
                              membersField.fields.findIndex(
                                (field) => field._id === member._id,
                              ),
                            );
                          } else {
                            membersField.append(member);
                          }
                        }}
                      />
                    </div>
                  );
                })}
                <Button
                  type="button"
                  onClick={() => {
                    // Trigger form submission
                    form.handleSubmit(handleSubmit)();
                  }}
                  className="mt-4"
                >
                  Send to selected
                </Button>
              </PopoverContent>
            </Popover>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                // Select all team members first
                form.setValue("members", team.members);
                // Trigger form submission
                form.handleSubmit(handleSubmit)();
              }}
            >
              Send to all
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <FieldError errors={errors} />
      </Field>
    </form>
  );
}
