"use client";

import { StatusUp } from "iconsax-reactjs";
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
import { toTitleCase } from "@/lib/utils";
import { getPlanName } from "../plan-meta";

type QuotaInfo = {
  metric: string | null;
  requiredPlan: string | null;
  currentPlan: string | null;
};

type UpgradePlanStore = QuotaInfo & {
  open: boolean;
  openUpgradePlan: (info: QuotaInfo) => void;
  closeUpgradePlan: () => void;
};

export const useUpgradePlanStore = create<UpgradePlanStore>()((set) => ({
  open: false,
  metric: null,
  requiredPlan: null,
  currentPlan: null,
  openUpgradePlan: (info) => set({ open: true, ...info }),
  closeUpgradePlan: () => set({ open: false }),
}));

// Callable from outside React, e.g. the global 402 interceptor in lib/api.ts
export const triggerUpgradePlan = (info: QuotaInfo) => {
  useUpgradePlanStore.getState().openUpgradePlan(info);
};

export const UpgradePlanDialog = () => {
  const open = useUpgradePlanStore((state) => state.open);
  const metric = useUpgradePlanStore((state) => state.metric);
  const requiredPlan = useUpgradePlanStore((state) => state.requiredPlan);
  const currentPlan = useUpgradePlanStore((state) => state.currentPlan);
  const closeUpgradePlan = useUpgradePlanStore(
    (state) => state.closeUpgradePlan,
  );

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

  const handleUpgrade = () => {
    closeUpgradePlan();
    window.location.href = "/dashboard/pricing";
  };

  const metricLabel = metric ? toTitleCase(metric) : "usage";
  const currentPlanLabel = getPlanName(currentPlan);
  const targetPlanLabel = requiredPlan
    ? getPlanName(requiredPlan)
    : "the next tier";

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) closeUpgradePlan();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <div ref={headerRef}>
          <DialogHeader className="sm:text-center">
            <div
              data-dialog-icon
              className="mx-auto mb-1 grid size-14 place-items-center rounded-full border border-primary/30 text-primary sm:size-16"
            >
              <StatusUp className="size-8" variant="Bold" />
            </div>
            <DialogTitle data-dialog-title className="sm:text-center">
              Upgrade your plan
            </DialogTitle>
            <DialogDescription data-dialog-desc className="sm:text-center">
              {requiredPlan ? (
                <>
                  You&apos;ve reached your{" "}
                  <span className="font-semibold text-foreground">
                    {metricLabel}
                  </span>{" "}
                  limit on{" "}
                  <span className="font-semibold text-foreground">
                    {currentPlanLabel}
                  </span>
                  . Unlock{" "}
                  <span className="font-semibold text-foreground">
                    {targetPlanLabel}
                  </span>{" "}
                  to keep going.
                </>
              ) : (
                <>
                  You&apos;ve reached your{" "}
                  <span className="font-semibold text-foreground">
                    {metricLabel}
                  </span>{" "}
                  limit. Upgrade to keep going.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter showCloseButton>
          <Button
            color="colorful"
            className="w-full sm:w-auto"
            onClick={handleUpgrade}
          >
            Upgrade plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
