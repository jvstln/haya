import {
  DashboardDescription,
  DashboardSlot,
  DashboardTitle,
} from "@/components/dashboard-ui";
import { PricingPlans } from "./pricing-plans";

export const PricingPage = () => {
  return (
    <DashboardSlot>
      <div className="text-center">
        <DashboardTitle className="text-3xl!">Upgrade your plan</DashboardTitle>
        <DashboardDescription>
          Select your best preferred subscription plan
        </DashboardDescription>
      </div>

      <PricingPlans />
    </DashboardSlot>
  );
};
