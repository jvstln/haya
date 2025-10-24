import { SidebarLayout } from "@/components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <SidebarLayout>{children}</SidebarLayout>;
};

export default DashboardLayout;
