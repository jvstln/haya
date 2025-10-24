import { TickCircle } from "iconsax-reactjs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const subscriptionPlans = [
  {
    name: "Free Plan",
    price: 0,
    period: "month",
    badge: "Starter",
    description: "Seamless onchain Ux analysis feedback",
    buttonText: "Current Plan",
    isCurrentPlan: true,
    features: [
      "Make confident UX audit for 2 website projects(Few hidden findings)",
      "Access onchain research-backed UX guidelines to improve every component.",
      "Explore AI UX-Query for easy idea iterations.",
      "Explore community resources.",
    ],
    accent: "--color-rose-300",
    accentForeground: "--color-background",
  },
  {
    name: "Pro Plan",
    price: 100,
    period: "month",
    badge: "Popular",
    description: "Seamless onchain Ux analysis feedback",
    buttonText: "Choose Plan",
    isCurrentPlan: false,
    features: [
      "All free plans",
      "Add 2 team member",
      "File shareable available",
      "1 product/website tracker",
      "5 agentic SDK integration",
      "Publish agentic SDK",
    ],
    accent: "--color-violet-300",
    accentForeground: "--color-background",
  },
  {
    name: "Max Plan",
    price: 500,
    period: "month",
    badge: "Enterprise",
    description: "Seamless onchain Ux analysis feedback",
    buttonText: "Choose Plan",
    isCurrentPlan: false,
    features: [
      "Add 4 team member",
      "File shareable available",
      "3 product/website tracker",
      "5 agentic SDK integration",
      "Publish agentic SDK",
    ],
    accent: "--color-violet-300",
    accentForeground: "--color-background",
  },
];

export const SubscriptionPlans = () => {
  return (
    <div className="mx-auto flex grid-cols-3 grid-rows-[2rem_auto_2rem] flex-col gap-4 text-white xl:container *:flex-1 max-lg:items-center lg:grid">
      {subscriptionPlans.map((plan, i) => (
        <div
          key={plan.name}
          className="w-full max-w-110 rounded-xl bg-card pb-5"
          style={{
            gridRow: i === 1 ? "1 / -1" : "2 / 3",
          }}
        >
          <div
            className="flex flex-col gap-4 rounded-xl border-transparent border-b p-4"
            style={{
              background: `linear-gradient(var(--color-card), var(--color-card)) padding-box,
              var(--colorful-gradient) border-box`,
            }}
          >
            {/* Price section */}
            <div className="flex h-43.5 flex-col justify-between rounded-xl bg-background p-6">
              <Badge
                style={{
                  background: `var(${plan.accent})`,
                  color: `var(${plan.accentForeground})`,
                }}
              >
                {plan.name}
              </Badge>
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center">
                  <span className="font-bold text-2xl">${plan.price}</span>
                  /month
                </div>
                <Badge
                  className="bg-card"
                  style={{ color: `var(${plan.accent})` }}
                >
                  {plan.badge}
                </Badge>
              </div>
            </div>

            <span>{plan.description}</span>
            <Button
              variant={plan.name.match(/pro|max/i) ? "colorful" : "outline"}
              className="h-12"
            >
              Choose plan
            </Button>
          </div>
          <ul className="space-y-4 p-4">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <TickCircle
                  color={`var(${plan.accent})`}
                  className="size-4 shrink-0"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
