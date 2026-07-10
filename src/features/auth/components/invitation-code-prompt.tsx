"use client";

import { useState } from "react";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

type InvitationStore = {
  open: boolean;
  code: string;
  resolve: ((code: string) => void) | null;
  reject: ((reason?: unknown) => void) | null;
};

export const useInvitationStore = create<InvitationStore>()(
  persist(
    (): InvitationStore => ({
      open: false,
      code: "",
      reject: null,
      resolve: null,
    }),
    {
      name: "haya.invitationCode",
      partialize: ({ code }) => ({ code }),
    },
  ),
);

export const getInvitationCode = async () => {
  let code: string = useInvitationStore.getState().code;

  if (code) {
    // Validate and return code if valid
    try {
      const response = await api.post("/beta/validate", { code });
      if (response.data?.valid) {
        return {
          code,
        };
      }
    } catch {}
  }

  const { promise, resolve, reject } = Promise.withResolvers<string>();

  useInvitationStore.setState({
    open: true,
    resolve: resolve,
    reject: reject,
  });

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
      <DialogContent className="py-20">
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
