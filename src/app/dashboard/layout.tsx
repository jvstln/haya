"use client";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function DashboardLayoutRoute({
  children,
}: LayoutProps<"/dashboard">) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
