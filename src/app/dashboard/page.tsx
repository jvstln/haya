import { redirect } from "next/navigation";
import { OnboardingDialog } from "@/features/auth/components/onboarding-dialog";

const DashboardHomepage = () => {
  redirect("/dashboard/analyze");
  return <OnboardingDialog open={true} />;
};

export default DashboardHomepage;
