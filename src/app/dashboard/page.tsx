import { redirect } from "next/navigation";

const DashboardHomepage = () => {
  redirect("/dashboard/analyze");
};

export default DashboardHomepage;
