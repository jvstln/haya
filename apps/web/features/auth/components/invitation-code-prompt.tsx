"use client";

import { useState } from "react";
import { toast } from "@workspace/ui/components/sonner";
import { create } from "zustand";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";

type InvitationStore = {
  open: boolean;
  code: string;
  resolve: ((code: string) => void) | null;
  reject: ((reason?: unknown) => void) | null;
};

export const useInvitationStore = create<InvitationStore>(() => ({
  open: false,
  code: "",
  reject: null,
  resolve: null,
}));

export const getInvitationCode = async () => {
  const { promise, resolve, reject } = Promise.withResolvers<string>();

  useInvitationStore.setState({
    open: true,
    code: "",
    resolve: resolve,
    reject: reject,
  });

  let code: string;

  try {
    code = await promise;
  } catch {
    code = "";
  }

  useInvitationStore.setState({ code, open: false });

  return {
    code,
    resolve,
    reject,
  };
};

export function InvitationCodePrompt() {
  const { open, resolve, reject } = useInvitationStore();
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!code) return toast.error("[FE]: Code is reuired to continue");
    resolve?.(code);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) reject?.("User cancelled");
      }}
    >
      <DialogContent className="w-full py-20">
        <DialogHeader>
          <DialogTitle>INVITATION CODE REQUIRED</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Enter invitation code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
          />
          <Button type="submit" disabled={!code.trim()}>
            Continue
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
