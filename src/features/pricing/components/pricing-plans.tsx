"use client";
import { CloseCircle, TickCircle } from "iconsax-reactjs";
import { useState } from "react";
import { QueryState } from "@/components/query-states";
import { cn, toTitleCase } from "@/lib/utils";
import { Button } from "../../../components/ui/button";
import { useCurrentPlan, usePlans, useSubscribeToPlan } from "../pricing.hook";

type FeatureItem = {
  text: string;
  included: boolean;
  subFeatures?: string[];
};

type PricingPlan = {
  key: string;
  name: string;
  price: number;
  yearlyDiscountPercent?: number; // e.g. 10 for 10% off
  period: string; // e.g. "month"
  description: string;
  buttonText: string;
  isCurrentPlan?: boolean;
  hasBillingToggle?: boolean;
  includedFeatures: FeatureItem[];
  notIncludedFeatures: FeatureItem[];
};

const pricingPlans: PricingPlan[] = [
  {
    key: "free",
    name: "Free Plan",
    price: 0,
    period: "month",
    description: "Perfect for individuals and early-stage builders",
    buttonText: "Current Plan",
    isCurrentPlan: true,
    hasBillingToggle: false,
    includedFeatures: [
      { text: "2 Track Experience analyses", included: true },
      { text: "10 Recorded Behavior Sessions", included: true },
      { text: "1 Behavioral Persona Analyses", included: true },
      { text: "Community Support", included: true },
    ],
    notIncludedFeatures: [
      { text: "Custom AI Insights", included: false },
      { text: "Ad Platform Integrations", included: false },
      { text: "Advanced Behavioral Reports", included: false },
      { text: "Priority Support", included: false },
    ],
  },
  {
    key: "starter",
    name: "Starter",
    price: 10,
    period: "month",
    description: "For startups validating product-market fit",
    buttonText: "Start a Plan",
    isCurrentPlan: false,
    hasBillingToggle: false,
    includedFeatures: [
      { text: "5 Track Experience analyses", included: true },
      { text: "50 Recorded Behavior Sessions", included: true },
      { text: "4 Behavioral Persona Analyses", included: true },
      { text: "Custom AI Insights (2 per month)", included: true },
      {
        text: "1 Connected Insight Channel (Slack, WhatsApp, Telegram, etc.)",
        included: true,
      },
      { text: "Basic Behavioral Reports", included: true },
    ],
    notIncludedFeatures: [
      { text: "Ad Platform Integrations", included: false },
      { text: "Advanced Audience Builder", included: false },
    ],
  },
  {
    key: "growth",
    name: "Growth",
    price: 30,
    yearlyDiscountPercent: 10,
    period: "month",
    description: "For growing teams optimizing user experience and marketing",
    buttonText: "Start a Plan",
    isCurrentPlan: false,
    hasBillingToggle: true,
    includedFeatures: [
      { text: "10 Track Experience analyses", included: true },
      { text: "5,000 Recorded Sessions", included: true },
      { text: "10 Behavioral Persona Analyses", included: true },
      { text: "Weekly AI Insights (4 per month)", included: true },
      {
        text: "All Connected Insight Channel (Slack, WhatsApp, Telegram, etc.)",
        included: true,
      },
      {
        text: "Up to 2 Ad Platform Integrations",
        included: true,
        subFeatures: ["Meta Ads", "Google Ads (or another supported platform)"],
      },
      { text: "Advanced Behavioral Reports", included: true },
      { text: "Behavioral Trend Analysis", included: true },
      { text: "Audience Recommendations", included: true },
    ],
    notIncludedFeatures: [],
  },
  {
    key: "scale",
    name: "Scale",
    price: 150,
    yearlyDiscountPercent: 10,
    period: "month",
    description: "For companies building with behavioral intelligence",
    buttonText: "Start a Plan",
    isCurrentPlan: false,
    hasBillingToggle: true,
    includedFeatures: [
      { text: "20 Track Experience analyses", included: true },
      { text: "10,000+ Recorded Sessions", included: true },
      { text: "20 Behavioral Persona Analyses", included: true },
      { text: "AI Insights Twice Per Week (8 per month)", included: true },
      { text: "Unlimited Ad Platform Integrations", included: true },
      { text: "Unlimited Insight Channels", included: true },
      { text: "Advanced Audience Builder", included: true },
      { text: "Predictive Behavioral Personas", included: true },
      { text: "AI Growth Recommendations", included: true },
    ],
    notIncludedFeatures: [],
  },
];

export const PricingPlans = () => {
  const plans = usePlans();
  const currentPlan = useCurrentPlan();
  const subscribe = useSubscribeToPlan();

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null); // For tracking loading state
  const handleStartPlan = (plan: string) => {
    setSelectedPlan(plan);
    subscribe.mutate(
      { planKey: plan },
      { onSettled: () => setSelectedPlan(null) },
    );
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 2xl:container 2xl:mx-auto">
      <QueryState query={plans} requireAuth={false}>
        {(plans) =>
          plans.data.map((plan) => {
            const planFallback = pricingPlans.find((p) => p.key === plan.key);
            const description = planFallback?.description;

            const includedFeatures = [
              ...Object.entries(plan.quotas).filter(([_, value]) => value),
              ...Object.entries(plan.features).filter(([_, value]) => value),
            ];

            const notIncludedFeatures = [
              ...Object.entries(plan.quotas).filter(([_, value]) => !value),
              ...Object.entries(plan.features).filter(([_, value]) => !value),
            ];

            const isCurrentPlan = currentPlan.data?.currentPlan === plan.key;

            return (
              <div
                key={plan.key}
                className="flex w-full flex-col gap-4 rounded-xl border bg-card p-4"
              >
                {/* Name and price section */}
                <div
                  className="flex basis-1/4 flex-col gap-4 rounded-xl bg-background p-4"
                  style={{
                    border: "0.3px solid transparent",
                    background:
                      "linear-gradient(var(--color-background), var(--color-background)) padding-box, var(--colorful-gradient) border-box",
                  }}
                >
                  <h2 className="font-bold text-2xl text-primary">
                    {plan.displayName}
                  </h2>
                  <div className="flex items-center">
                    <span className="font-bold text-2xl">
                      ${plan.priceUsdMonthly}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      /month
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-6.75">
                    {description}
                  </p>
                </div>
                <Button
                  data-require-auth
                  disabled={isCurrentPlan}
                  isLoading={subscribe.isPending && selectedPlan === plan.key}
                  color="secondary"
                  appearance={"ghost"}
                  // size="lg"
                  className={cn(
                    "before:-z-10 relative isolate rounded-full before:absolute before:inset-0 before:rounded-[inherit] before:border-[0.3px] before:border-transparent",
                    "before:[background:linear-gradient(var(--color-muted)_0_0)_padding-box,var(--colorful-gradient)_border-box] hover:before:[background:linear-gradient(var(--bg)_0_0)_padding-box,var(--colorful-gradient)_border-box]",
                    isCurrentPlan && "text-primary-compliment",
                    !isCurrentPlan && "text-primary",
                  )}
                  onClick={() => handleStartPlan(plan.key)}
                >
                  {isCurrentPlan ? "Current plan" : "Start a plan"}
                </Button>

                {/* Included features */}
                <ul className="flex flex-col gap-4">
                  {includedFeatures.map(([key, value]) => (
                    <li
                      key={key}
                      className="flex items-center gap-4 text-muted-foreground text-sm"
                    >
                      <TickCircle className="size-4 shrink-0 stroke-4 text-primary" />
                      {value === -1 ? "Unlimited" : value} {toTitleCase(key)}
                    </li>
                  ))}
                </ul>

                {/* Not included features */}
                {notIncludedFeatures.length > 0 && (
                  <>
                    <h3 className="font-bold">Not Included</h3>
                    <ul className="flex flex-col gap-4">
                      {notIncludedFeatures.map(([key]) => (
                        <li
                          key={key}
                          className="flex items-center gap-4 text-muted-foreground text-sm"
                        >
                          <CloseCircle className="size-4 shrink-0 stroke-4 text-destructive" />
                          {toTitleCase(key)}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            );
          })
        }
      </QueryState>
    </div>
  );
};
