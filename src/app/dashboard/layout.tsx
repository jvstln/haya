"use client";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { HayaSpinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/auth.hook";

export default function DashboardLayoutRoute({
  children,
}: LayoutProps<"/dashboard">) {
  const auth = useAuth();

  if (auth.isPending) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <HayaSpinner />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
