"use client";

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
import { toTitleCase } from "@/lib/utils";

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

  const handleUpgrade = () => {
    closeUpgradePlan();
    window.location.href = "/dashboard/pricing";
  };

  const metricLabel = metric ? toTitleCase(metric) : "usage";
  const currentPlanLabel = currentPlan
    ? toTitleCase(currentPlan)
    : "your current plan";

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) closeUpgradePlan();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade your plan</DialogTitle>
          <DialogDescription>
            {requiredPlan ? (
              <>
                You&apos;ve reached your {metricLabel} limit on the{" "}
                {currentPlanLabel} plan. Upgrade to {toTitleCase(requiredPlan)}{" "}
                or higher to continue.
              </>
            ) : (
              <>
                You&apos;ve reached your {metricLabel} limit. Upgrade to keep
                going.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button color="primary" onClick={handleUpgrade}>
            Upgrade plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
