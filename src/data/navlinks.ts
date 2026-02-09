import {
  Archive,
  ClipboardExport,
  CodeCircle,
  type Icon,
  People,
  Ranking,
  Scan,
  Shop,
} from "iconsax-reactjs";
import type { Route } from "next";

export type LinkItem = {
  title: string;
  url: Route;
  icon: Icon;
  tooltip?: React.ReactNode;
  exact?: boolean; // Default is true
};
export type LinkGroupLabel = { title: string };
export type SidebarItemable = LinkGroupLabel | LinkItem;
export type LinkGroup = { title: string; items: LinkItem[] };

const sidebarContents = {
  "/dashboard/audits/*": [
    { title: "Audit Dashboard", url: "/dashboard/audits", icon: Scan },
    { title: "Overview" },
    {
      title: "Case Dashboard",
      url: "/dashboard/audits/[auditId]/case" as Route,
      icon: Archive,
    },
    {
      title: "Campaign",
      url: "#",
      icon: ClipboardExport,
      tooltip: "Coming Soon",
    },
    {
      title: "Perfomance Metrics",
      url: "#",
      icon: Ranking,
      tooltip: "Coming Soon",
    },
    { title: "Team", url: "#", icon: People, tooltip: "Coming Soon" },
  ],
  "/dashboard/*": [
    { title: "Audit Dashboard", url: "/dashboard/audits", icon: Scan },
    {
      title: "Resources",
      url: "/dashboard/resources",
      icon: Shop,
    },
    {
      title: "Agentic SDK's",
      url: "#",
      icon: CodeCircle,
      tooltip: "Coming Soon",
    },
    {
      title: "Team",
      url: "#",
      icon: People,
      tooltip: "Coming Soon",
    },
  ],
} as const satisfies Record<string, SidebarItemable[]>;

export const getSidebarContent = (pathname: string) => {
  for (const pattern in sidebarContents) {
    const regex = new RegExp(`^${pattern.replaceAll("*", ".*")}$`);
    if (regex.test(pathname)) {
      return sidebarContents[pattern as keyof typeof sidebarContents];
    }
  }

  return sidebarContents["/dashboard/*"];
};
