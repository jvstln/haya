import { api } from "@/lib/api";
import type {
  BillingInterval,
  CurrentPlanDetail,
  PricingPlan,
  PricingPlanDetail,
} from "./pricing.type";

export const getPlans = async () => {
  const response = await api.get<{ data: PricingPlan[] }>(
    "/subscription/plans",
  );
  return response.data.data;
};

export const getCurrentPlan = async () => {
  const response = await api.get<{ data: CurrentPlanDetail }>(
    "/subscription/plan-info",
  );
  return response.data.data;
};

export const getPlanDetails = async (params: {
  planKey: string;
  billingInterval?: BillingInterval;
}) => {
  const response = await api.get<{ data: PricingPlanDetail }>(
    "/subscription/quote",
    { params },
  );
  return response.data.data;
};

export const subscribeToPlan = async (payload: {
  planKey: string;
  billingInterval?: BillingInterval;
  paymentSignature: string;
}) => {
  const response = await api.post("/subscription/checkout", payload);
  return response.data;
};

export const cancelPlan = async () => {
  const response = await api.post("/subscription/cancel");
  return response.data;
};
