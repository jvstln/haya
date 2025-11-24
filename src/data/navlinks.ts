import {
  Archive,
  ClipboardExport,
  CodeCircle,
  People,
  Ranking,
  Scan,
  Shop,
} from "iconsax-reactjs";
import type { SidebarItemable } from "@/components/app-sidebar";

const sidebarContents = {
  "/dashboard/audits/*": [
    { title: "Audit Dashboard", url: "/dashboard/audits", icon: Scan },
    { title: "Overview" },
    {
      title: "Case Dashboard",
      url: "/dashboard/audits/[auditId]/case",
      icon: Archive,
    },
    {
      title: "Campaign",
      url: "campaigne",
      icon: ClipboardExport,
      tooltip: "Coming Soon",
    },
    {
      title: "Perfomance Metrics",
      url: "metrics",
      icon: Ranking,
      tooltip: "Coming Soon",
    },
    { title: "Team", url: "team", icon: People, tooltip: "Coming Soon" },
  ],
  "/dashboard/*": [
    { title: "Audit Dashboard", url: "/dashboard/audits", icon: Scan },
    {
      title: "Resources",
      url: "/dashboard/resources",
      icon: Shop,
      tooltip: "Coming Soon",
    },
    {
      title: "Agentic SDK's",
      url: "/dashboard/sdk",
      icon: CodeCircle,
      tooltip: "Coming Soon",
    },
    {
      title: "Team",
      url: "/dashboard/community",
      icon: People,
      tooltip: "Coming Soon",
    },
  ],
} as const as Record<string, SidebarItemable[]>;

export const getSidebarContent = (pathname: string) => {
  for (const pattern in sidebarContents) {
    const regex = new RegExp(`^${pattern.replaceAll("*", ".*")}$`);
    if (regex.test(pathname)) {
      return sidebarContents[pattern as keyof typeof sidebarContents];
    }
  }

  return sidebarContents["/dashboard/*"];
};
