export type BillingInterval = "monthly" | "yearly";

export type PricingPlan = {
  _id: string;
  key: string;
  createdAt: string;
  displayName: string;
  features: PricingPlanFeatures;
  isActive: boolean;
  priceUsdMonthly: number;
  priceUsdYearly: number;
  quotas: PricingPlanQuotas;
  updatedAt: string;
};

export type PricingPlanFeatures = {
  communitySupport: boolean;
  basicBehavioralReports: boolean;
  advancedBehavioralReports: boolean;
  behavioralTrendAnalysis: boolean;
  audienceRecommendations: boolean;
  advancedAudienceBuilder: boolean;
  predictiveBehavioralPersonas: boolean;
  aiGrowthRecommendations: boolean;
};

export type PricingPlanQuotas = {
  trackExperienceAnalyses: number;
  recordedSessions: number;
  personaAnalyses: number;
  aiInsights: number;
  connectedInsightChannels: number;
  adPlatformIntegrations: number;
};

export type CurrentPlanDetail = {
  currentPlan: string;
  billingInterval: BillingInterval;
  currentPeriodEnd: unknown;
  usage: {
    trackExperienceAnalyses: {
      used: number;
      limit: unknown;
      enforced: boolean;
    };
    recordedSessions: {
      used: number;
      limit: unknown;
      enforced: boolean;
    };
    personaAnalyses: {
      used: number;
      limit: unknown;
      enforced: boolean;
    };
    aiInsights: {
      used: number;
      limit: number;
      enforced: boolean;
    };
    connectedInsightChannels: {
      used: number;
      limit: number;
      enforced: boolean;
    };
    adPlatformIntegrations: {
      used: number;
      limit: number;
      enforced: boolean;
    };
  };
  riskLevel: "none" | "low" | "medium" | "high";
};

export type PricingPlanDetail = {
  planKey: string;
  billingInterval: BillingInterval;
  totalPriceUsd: 10;
  currency: "USDC";
  network: "solana-mainnet";
  receivingAddress: string;
  usdcMintAddress: string;
};
