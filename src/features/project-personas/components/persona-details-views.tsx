"use client";

import { ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Persona } from "../project-persona.type";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PersonaDetailItem {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "low" | "info" | string;
  category: string;
  impactLabel?: string;
  impactValue?: string;
  impactDescription?: string;
  rootCause?: string;
  recommendation?: string;
  implementationSteps?: string[];
  complexity?: "low" | "medium" | "high";
  estimatedEffort?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getSeverityStyle = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case "critical":
      return {
        bg: "bg-red-500",
        text: "text-red-400",
        glow: "shadow-[0_0_8px_rgba(239,68,68,0.4)]",
      };
    case "warning":
    case "high":
      return {
        bg: "bg-amber-500",
        text: "text-amber-400",
        glow: "shadow-[0_0_8px_rgba(245,158,11,0.4)]",
      };
    case "medium":
      return {
        bg: "bg-sky-500",
        text: "text-sky-400",
        glow: "shadow-[0_0_8px_rgba(14,165,233,0.4)]",
      };
    default:
      return {
        bg: "bg-emerald-500",
        text: "text-emerald-400",
        glow: "shadow-[0_0_8px_rgba(34,197,94,0.4)]",
      };
  }
};

const getComplexityBadge = (complexity?: string) => {
  switch (complexity?.toLowerCase()) {
    case "low":
      return (
        <Badge className="border-none bg-emerald-500/10 font-semibold text-emerald-400">
          Low Complexity
        </Badge>
      );
    case "high":
      return (
        <Badge className="border-none bg-red-500/10 font-semibold text-red-400">
          High Complexity
        </Badge>
      );
    default:
      return (
        <Badge className="border-none bg-sky-500/10 font-semibold text-sky-400">
          Medium Complexity
        </Badge>
      );
  }
};

// ---------------------------------------------------------------------------
// PersonaDetailSheet Component
// ---------------------------------------------------------------------------

interface PersonaDetailSheetProps {
  item: PersonaDetailItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PersonaDetailSheet = ({
  item,
  open,
  onOpenChange,
}: PersonaDetailSheetProps) => {
  if (!item) return null;

  const severityStyle = getSeverityStyle(item.severity);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader className="border-border/20 border-b px-5 py-4">
          <SheetTitle>Finding Details</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-hidden">
          <div className="flex flex-col gap-6 px-5 py-5">
            {/* Title + badges */}
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-base text-white leading-snug">
                {item.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {item.category && (
                  <Badge className="border-none bg-primary/10 font-medium text-primary capitalize">
                    {item.category.replace(/_/g, " ")}
                  </Badge>
                )}
                <Badge
                  className={cn(
                    "border-none font-semibold capitalize",
                    severityStyle.text,
                    "bg-white/5",
                  )}
                >
                  <span
                    className={cn(
                      "mr-1.5 inline-block size-1.5 rounded-full",
                      severityStyle.bg,
                      severityStyle.glow,
                    )}
                  />
                  {item.severity}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Description
              </p>
              <p className="text-sm text-white/80 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Root Cause */}
            {item.rootCause && (
              <div className="flex flex-col gap-1.5">
                <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Root cause
                </p>
                <p className="text-sm text-white/80 leading-relaxed">
                  {item.rootCause}
                </p>
              </div>
            )}

            {/* Recommendation */}
            {item.recommendation && (
              <div className="flex flex-col gap-1.5">
                <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Recommended fix
                </p>
                <p className="text-sm text-white/80 leading-relaxed">
                  {item.recommendation}
                </p>
              </div>
            )}

            {/* Implementation Steps */}
            {item.implementationSteps &&
              item.implementationSteps.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                      Implementation steps
                    </p>
                    <div className="flex items-center gap-2">
                      {getComplexityBadge(item.complexity)}
                      {item.estimatedEffort && (
                        <Badge className="flex items-center gap-1 border-white/10 bg-transparent font-semibold text-muted-foreground">
                          <Clock className="size-3" />
                          {item.estimatedEffort}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {item.implementationSteps.map((step) => (
                      <div key={step} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="text-sm text-white/75 leading-relaxed">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Business Impact Card */}
            {item.impactLabel && (
              <div className="flex flex-col gap-3">
                <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Business Impact
                </p>
                <Card className="border border-white/5 bg-neutral-900/50">
                  <CardContent className="pt-4">
                    <div className="mb-3 flex items-start justify-between gap-4 border-white/5 border-b pb-3">
                      <div>
                        <span className="mb-1 block text-muted-foreground text-xs">
                          Metric affected
                        </span>
                        <span className="font-semibold text-sm text-white leading-tight">
                          {item.impactLabel}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="mb-1 block text-muted-foreground text-xs">
                          Current Value / Estimate
                        </span>
                        <span className="block font-bold text-emerald-400 text-sm tracking-wide">
                          {item.impactValue}
                        </span>
                      </div>
                    </div>
                    {item.impactDescription && (
                      <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                        {item.impactDescription}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

// ---------------------------------------------------------------------------
// PersonaDetailsTabContent Component (Renders Table + Impact panel)
// ---------------------------------------------------------------------------

interface PersonaDetailsTabContentProps {
  items: PersonaDetailItem[];
}

const PersonaDetailsTabContent = ({ items }: PersonaDetailsTabContentProps) => {
  const [sheetItem, setSheetItem] = useState<PersonaDetailItem | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const activeItem = items.find((i) => i.id === activeItemId) ?? items[0];

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 border-dashed bg-secondary/5 px-4 py-16 text-center">
        <Sparkles className="mb-3 size-12 text-muted-foreground/40" />
        <h4 className="mb-1 font-semibold text-base text-white">
          No Data Available
        </h4>
        <p className="max-w-md text-muted-foreground text-sm">
          No metrics or signals were defined for this category.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Items Table */}
        <div className="overflow-hidden rounded-xl border border-white/5 bg-neutral-900/30 backdrop-blur-xs">
          {/* Header */}
          <div className="grid grid-cols-[100px_1fr_120px_60px] items-center border-white/5 border-b bg-neutral-950/20 px-6 py-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider max-sm:grid-cols-[80px_1fr_40px] max-sm:px-4">
            <div>Severity</div>
            <div>Metric / Signal</div>
            <div className="max-sm:hidden">Impact / Value</div>
            <div className="text-right">Action</div>
          </div>

          <div className="divide-y divide-white/5">
            {items.map((item) => {
              const isActive = activeItem?.id === item.id;
              const style = getSeverityStyle(item.severity);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveItemId(item.id)}
                  className={cn(
                    "group grid w-full cursor-pointer grid-cols-[100px_1fr_120px_60px] items-center px-6 py-5 text-left outline-none transition-all duration-200 hover:bg-white/2 focus-visible:bg-white/2 max-sm:grid-cols-[80px_1fr_40px] max-sm:px-4",
                    isActive
                      ? "border-primary border-l-2 bg-white/3"
                      : "border-transparent border-l-2",
                  )}
                >
                  {/* Severity */}
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        style.bg,
                        style.glow,
                      )}
                    />
                    <span
                      className={cn(
                        "font-semibold text-xs capitalize tracking-wide",
                        style.text,
                      )}
                    >
                      {item.severity}
                    </span>
                  </div>

                  {/* Detail */}
                  <div className="min-w-0 pr-4">
                    <h5 className="font-semibold text-sm text-white leading-tight transition-colors group-hover:text-primary max-sm:text-xs">
                      {item.title}
                    </h5>
                    <p className="mt-1 line-clamp-1 text-muted-foreground/80 text-xs leading-relaxed max-sm:hidden">
                      {item.description}
                    </p>
                  </div>

                  {/* Impact */}
                  <div className="max-sm:hidden">
                    <span className="font-semibold text-emerald-400 text-xs tracking-wide">
                      {item.impactValue || "N/A"}
                    </span>
                  </div>

                  {/* Action Arrow */}
                  <div className="flex justify-end">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSheetItem(item);
                      }}
                      appearance={"ghost"}
                      color={"secondary"}
                      size={"icon"}
                    >
                      <ArrowRight className="transition group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Business Impact Card */}
        {activeItem?.impactLabel && (
          <div>
            <p className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Business Impact & Context
            </p>
            <Card className="border border-white/5 bg-neutral-900/30 backdrop-blur-xs">
              <CardContent className="pt-5">
                <div className="mb-4 flex items-start justify-between gap-4 border-white/5 border-b pb-4">
                  <div>
                    <span className="mb-1 block text-muted-foreground text-xs">
                      Metric affected
                    </span>
                    <span className="font-semibold text-sm text-white leading-tight">
                      {activeItem.impactLabel}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="mb-1 block text-muted-foreground text-xs">
                      Current Value / Estimate
                    </span>
                    <span className="block font-bold text-emerald-400 text-sm tracking-wide">
                      {activeItem.impactValue}
                    </span>
                  </div>
                </div>
                {activeItem.impactDescription && (
                  <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                    {activeItem.impactDescription}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <PersonaDetailSheet
        item={sheetItem}
        open={!!sheetItem}
        onOpenChange={(open) => !open && setSheetItem(null)}
      />
    </>
  );
};

// ---------------------------------------------------------------------------
// PersonaDetailsViews Component (Wrapper & Tabs Setup)
// ---------------------------------------------------------------------------

interface PersonaDetailsViewsProps {
  persona: Persona;
}

export const PersonaDetailsViews = ({ persona }: PersonaDetailsViewsProps) => {
  const behaviorItems: PersonaDetailItem[] = [
    {
      id: "duration",
      title: "Session Duration Profile",
      description: `This persona segment represents users with session durations between ${persona.sessionSignature?.minDuration ?? 0} and ${persona.sessionSignature?.maxDuration ?? 300} seconds.`,
      severity: persona.avgSessionDuration < 30 ? "warning" : "low",
      category: "Session Signature",
      impactLabel: "Avg. Duration",
      impactValue: `${persona.avgSessionDuration}s`,
      impactDescription:
        "Short session durations indicate potential early exits, bounce rate, or task abandonment, reducing overall user lifetime value.",
      rootCause:
        "Slow initial page loads, poor immediate engagement, or failure to communicate value propositions above the fold.",
      recommendation:
        "Improve performance, optimize above-the-fold layout, and present clear value propositions early in the user journey.",
      implementationSteps: [
        "Compress assets and optimize scripts for faster page load times.",
        "A/B test different homepage headlines and hero sections.",
        "Ensure the layout is highly engaging and clean on mobile devices.",
      ],
      complexity: "medium",
      estimatedEffort: "1-2 days",
    },
    {
      id: "rage-clicks",
      title: "Frustrated Clicking (Rage Clicks)",
      description: `Rage clicking is triggered when a user clicks the same element multiple times in rapid succession. This segment has a rage click rate of ${Math.round((persona.rageClickRate ?? 0) * 100)}% (minimum of ${persona.sessionSignature?.minRageClicks ?? 0} rage clicks per session).`,
      severity: (persona.rageClickRate ?? 0) > 0.1 ? "critical" : "warning",
      category: "Behavioral Signal",
      impactLabel: "Rage Click Rate",
      impactValue: `${Math.round((persona.rageClickRate ?? 0) * 100)}%`,
      impactDescription:
        "High rage click rates strongly correlate with user frustration, leading to immediate site abandonment and a decrease in customer trust.",
      rootCause:
        "Broken buttons, non-responsive elements, slow API calls, or confusing UI components that resemble clickable links.",
      recommendation:
        "Review high click-density areas on the affected page and ensure all interactive elements respond promptly.",
      implementationSteps: [
        "Identify exactly which elements on the affected page are triggering rage clicks using replay details.",
        "Add loading indicators or disable buttons during async operations.",
        "Ensure clickable areas have visual hover states and clear functions.",
      ],
      complexity: "low",
      estimatedEffort: "1 day",
    },
    {
      id: "conversion",
      title: "CTA Conversion Rate",
      description: `CTA conversion reflects the percentage of users in this persona who successfully clicked a primary Call-to-Action. Currently, the conversion rate is ${Math.round((persona.ctaConversionRate ?? 0) * 100)}% (conversion required: ${persona.sessionSignature?.requiresConversion ? "Yes" : "No"}).`,
      severity: (persona.ctaConversionRate ?? 0) < 0.05 ? "critical" : "low",
      category: "Behavioral Signal",
      impactLabel: "CTA Conversion",
      impactValue: `${Math.round((persona.ctaConversionRate ?? 0) * 100)}%`,
      impactDescription:
        "Low CTA conversion rate directly restricts customer acquisition and business revenue growth.",
      rootCause:
        "Unclear or hidden call-to-actions, high form friction, or mismatch between user expectations and page layout.",
      recommendation:
        "Simplify form inputs, optimize CTA copy and placement, and use clear contrast to make action buttons stand out.",
      implementationSteps: [
        "Redesign the primary CTA to be visually dominant and placed above the fold.",
        "Reduce the number of form fields to the absolute minimum.",
        "Include social proof or security badges close to key conversion buttons.",
      ],
      complexity: "medium",
      estimatedEffort: "2-3 days",
    },
    {
      id: "affected-page",
      title: "Affected Page Usability",
      description: `The behavioral pattern for this persona is most prominent on the page: "${persona.affectedPage || "/"}". User interaction issues here prevent progressing further down the funnel.`,
      severity: "info",
      category: "Context",
      impactLabel: "Affected Page",
      impactValue: persona.affectedPage || "/",
      impactDescription:
        "High concentration of issues on specific pages creates a bottleneck in the conversion pipeline.",
      rootCause:
        "Layout friction, poor usability, or broken links on the entry/affected page.",
      recommendation:
        "Perform a usability audit and heat map analysis on the affected page to streamline user pathways.",
      implementationSteps: [
        "Verify styling and responsive layout of the page across different viewport widths.",
        "Examine navigation links to ensure all lead to the correct destination.",
        "Add heatmapping or analytics events to track exact user drop-off points.",
      ],
      complexity: "low",
      estimatedEffort: "1-2 days",
    },
  ];

  const frictionItems: PersonaDetailItem[] = [
    {
      id: "psychological-friction",
      title: "Psychological Friction Analysis",
      description: `This persona experience is highly impacted by: "${persona.psychologicalFriction}". Psychological friction measures the cognitive burden, confusion, or hesitation experienced by the user.`,
      severity: persona.severity || "warning",
      category: "Friction Analysis",
      impactLabel: "Friction Type",
      impactValue: persona.psychologicalFriction || "High Friction",
      impactDescription:
        "Cognitive friction causes users to doubt their choices, leading to delayed decisions or immediate abandonment.",
      rootCause:
        "Unclear instructions, lack of progress indicators, visual clutter, or overwhelming choices.",
      recommendation:
        "Provide intuitive cues, clear progress bars, and simplify page layouts to guide user choice.",
      implementationSteps: [
        "Clean up unnecessary visual elements to focus attention on key pathways.",
        "Add contextual tooltips or helper text for complex terms.",
        "Simplify multi-step processes into single-column, clear steps.",
      ],
      complexity: "medium",
      estimatedEffort: "2 days",
    },
    {
      id: "business-impact",
      title: "Business Impact Breakdown",
      description:
        persona.businessImpact ||
        "Potential lost conversions in user journeys.",
      severity: persona.severity || "warning",
      category: "Business Impact",
      impactLabel: "Estimated Impact",
      impactValue: `${persona.percentage}% of Traffic`,
      impactDescription: `This persona represents ${persona.percentage}% of your visitors. Resolving their issues will significantly improve funnel throughput.`,
      rootCause:
        "Ineffective conversion paths that fail to retain or nudge interested visitors.",
      recommendation: persona.recommendation,
      implementationSteps: [
        "Estimate the potential revenue lift of converting even 5% more of this persona group.",
        "Share session recordings of this cohort with design and product teams.",
        "Implement the priority recommendations to validate user response.",
      ],
      complexity: "high",
      estimatedEffort: "3-5 days",
    },
    {
      id: "recommendations",
      title: "Recommended Action Plan",
      description: persona.recommendation || "Follow optimization steps.",
      severity: "low",
      category: "Action Plan",
      impactLabel: "Status",
      impactValue: "Action Required",
      impactDescription:
        "Actionable recommendations designed specifically to resolve this persona's core problems.",
      rootCause:
        "Identified design and performance gaps causing high drop-off.",
      recommendation: persona.recommendation,
      implementationSteps: [
        "Prioritize task tickets according to severity (Critical issues first).",
        "Draft UI tweaks to align layout with user expectations.",
        "Redeploy and track the new conversion/rage-click rates for this segment.",
      ],
      complexity: "low",
      estimatedEffort: "1-3 days",
    },
  ];

  const marketingItems: PersonaDetailItem[] = [
    {
      id: "marketing-channel",
      title: "Campaign Re-engagement Channel",
      description: `The recommended channel to retarget and re-engage users belonging to this persona is: "${persona.marketingCampaign?.channel ?? "Email"}".`,
      severity: "low",
      category: "Marketing Strategy",
      impactLabel: "Outreach Channel",
      impactValue: persona.marketingCampaign?.channel ?? "Email",
      impactDescription:
        "Choosing the correct communication medium ensures higher response and engagement rates.",
      rootCause:
        "Traditional static outreach lacks context; targeting via specific channels matches user presence.",
      recommendation: `Deploy a tailored re-engagement flow using ${persona.marketingCampaign?.channel ?? "Email"} outreach.`,
      implementationSteps: [
        "Setup dynamic cohort audience lists in your marketing automation platform.",
        "Configure trigger events based on session signature criteria.",
        "A/B test different delivery times for optimized open rates.",
      ],
      complexity: "medium",
      estimatedEffort: "1 day",
    },
    {
      id: "marketing-subject",
      title: "Campaign Headline / Subject Line",
      description: `Optimized headline or subject line for outreach: "${persona.marketingCampaign?.subject ?? "Reconnect with Haya"}". This subject is crafted to resonate with the persona's frustration or browsing style.`,
      severity: "low",
      category: "Campaign Asset",
      impactLabel: "Subject Line",
      impactValue: "Ready to Use",
      impactDescription:
        "Compelling subject lines drastically improve open rates and re-establish engagement.",
      rootCause:
        "Generic marketing materials fail to capture attention of users who left due to specific issues.",
      recommendation: `Use the suggested subject line: "${persona.marketingCampaign?.subject ?? ""}" to re-initiate contact.`,
      implementationSteps: [
        "Incorporate the subject line into your email/social template.",
        "Add personalization tokens (e.g. User First Name) to the headline.",
        "Monitor click-through rates relative to standard generic subjects.",
      ],
      complexity: "low",
      estimatedEffort: "1 day",
    },
    {
      id: "marketing-body",
      title: "Campaign Message / Outreach Copy",
      description: `The customized message body is designed to directly address the user's friction and offer a path forward: "${persona.marketingCampaign?.body ?? ""}"`,
      severity: "low",
      category: "Campaign Copy",
      impactLabel: "Campaign Copy",
      impactValue: "Copy Available",
      impactDescription:
        "Tailored outreach messaging shows empathy and provides immediate compensation (e.g. offers or guides), increasing conversion.",
      rootCause:
        "Friction makes the user feel undervalued; a supportive, personalized offer makes them feel appreciated.",
      recommendation:
        "Utilize the provided text layout in your retargeting campaigns.",
      implementationSteps: [
        "Insert the suggested body copy into your outreach template.",
        "Ensure the link inside the campaign directs to a frictionless page.",
        "Include a tracking link (UTM parameter) to analyze performance.",
      ],
      complexity: "low",
      estimatedEffort: "1-2 days",
    },
  ];

  const tabsConfig = [
    { id: "behavior", label: "Behavior & Rules", items: behaviorItems },
    { id: "friction", label: "Friction & Impact", items: frictionItems },
    { id: "marketing", label: "Outreach Campaign", items: marketingItems },
  ];

  return (
    <Card className="flex h-full flex-col">
      <Tabs defaultValue="behavior" className="flex h-full flex-col">
        <CardHeader>
          <CardTitle className="mb-4 text-h3">
            Persona Insight Breakdown
          </CardTitle>
          <ScrollArea className="w-full min-w-0 pb-2.5">
            <TabsList>
              {tabsConfig.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  render={(props, state) => (
                    <Button
                      {...props}
                      appearance={state.active ? "solid" : "ghost"}
                      color={"secondary"}
                      size="sm"
                    />
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar className="text-secondary" orientation="horizontal" />
          </ScrollArea>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 pt-6">
          {tabsConfig.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <PersonaDetailsTabContent items={tab.items} />
            </TabsContent>
          ))}
        </CardContent>
      </Tabs>
    </Card>
  );
};
