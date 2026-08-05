"use client";

import { Crown } from "iconsax-reactjs";
import { useEffect, useRef } from "react";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { gsap } from "@/lib/gsap.util";
import { getPlanName } from "../plan-meta";

type BillingSuccessStore = {
  open: boolean;
  planKey: string | null;
  openSuccess: (planKey: string) => void;
  closeSuccess: () => void;
};

export const useBillingSuccessStore = create<BillingSuccessStore>((set) => ({
  open: false,
  planKey: null,
  openSuccess: (planKey) => set({ open: true, planKey }),
  closeSuccess: () => set({ open: false }),
}));

// Callable from outside React, e.g. the subscribe mutation in pricing.hook.ts
export const triggerPlanSuccess = (planKey: string) => {
  useBillingSuccessStore.getState().openSuccess(planKey);
};

export const BillingSuccessDialog = () => {
  const open = useBillingSuccessStore((state) => state.open);
  const planKey = useBillingSuccessStore((state) => state.planKey);
  const closeSuccess = useBillingSuccessStore((state) => state.closeSuccess);

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !headerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-dialog-icon]",
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
      );
      gsap.fromTo(
        "[data-dialog-title]",
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.05 },
      );
      gsap.fromTo(
        "[data-dialog-desc]",
        { y: 6, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.1 },
      );
    }, headerRef);

    return () => ctx.revert();
  }, [open]);

  const planName = getPlanName(planKey);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) closeSuccess();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <div ref={headerRef}>
          <DialogHeader className="sm:text-center">
            <div
              data-dialog-icon
              className="mx-auto mb-1 grid size-16 place-items-center rounded-2xl border border-primary/30 text-primary sm:size-20"
            >
              <Crown className="size-8 sm:size-9" variant="Bold" />
            </div>
            <DialogTitle data-dialog-title className="sm:text-center">
              Welcome to {planName}
            </DialogTitle>
            <DialogDescription data-dialog-desc className="sm:text-center">
              Your{" "}
              <span className="font-semibold text-foreground">{planName}</span>{" "}
              plan is now active and unlocked.
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter>
          <Button
            color="colorful"
            className="w-full sm:w-auto"
            onClick={closeSuccess}
          >
            Let&apos;s go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
