import { toTitleCase } from "@/lib/utils";

export const PLAN_META: Record<string, { name: string; price: number }> = {
  free: { name: "Free", price: 0 },
  starter: { name: "Starter", price: 10 },
  growth: { name: "Growth", price: 30 },
  scale: { name: "Scale", price: 150 },
};

export function getPlanName(key?: string | null): string {
  if (!key) return "Free";
  return PLAN_META[key]?.name ?? toTitleCase(key);
}

export function getPlanPrice(key?: string | null): number {
  if (!key) return 0;
  return PLAN_META[key]?.price ?? 0;
}
