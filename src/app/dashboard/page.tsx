import { redirect } from "next/navigation";

const DashboardHomepage = async () => {
  redirect("/dashboard/audits");
};

export default DashboardHomepage;
