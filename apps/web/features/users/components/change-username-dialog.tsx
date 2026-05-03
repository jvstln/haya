"use client";

import { Edit } from "iconsax-reactjs";
import { useState } from "react";
import { toast } from "@workspace/ui/components/sonner";
import z from "zod";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { useAuth } from "@/features/auth/auth.hook";
import { useUpdateUsername } from "../user.hook";

type ChangeUsernameDialogProps = React.ComponentProps<typeof Dialog>;

export const changeUsernameStore = create(
  combine({ showDialogOnPageLoad: false }, (set) => ({
    setShowDialogOnPageLoad: (value: boolean) =>
      set({ showDialogOnPageLoad: value }),
  })),
);

export const ChangeUsernameDialogGuard = () => {
  const auth = useAuth();
  const shouldChangeUsername = !!(auth.user && !auth.user?.hasUpdatedUsername);

  return (
    <ChangeUsernameDialog
      open={shouldChangeUsername}
      onOpenChange={(open) => {
        if (!open) auth.refreshAuth();
      }}
    />
  );
};

export function ChangeUsernameDialog({
  children,
  ...props
}: ChangeUsernameDialogProps) {
  const [_open, _setOpen] = useState(props.defaultOpen);
  const open = props.open ?? _open;
  const setOpen = (open: boolean) => {
    props.onOpenChange?.(open);
    _setOpen(open);
  };

  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const updateUsername = useUpdateUsername();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = z
      .string()
      .trim()
      .min(1, "Username is empty")
      .safeParse(username);

    if (!result.success) {
      return toast.error(result.error.message);
    }

    await updateUsername.mutateAsync({ username: result.data });
    setOpen(false);
  };

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Username</DialogTitle>
          <DialogDescription>
            Edit your profile name to enable easy accessibility
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 py-4">
            <label htmlFor="username" className="font-medium text-sm">
              Name
            </label>
            <InputGroup>
              <InputGroupInput
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
              <InputGroupAddon>@</InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Edit className="size-4 text-primary" />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <Button
            type="submit"
            color="primary"
            className="w-full"
            disabled={updateUsername.isPending}
          >
            Save Name
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
