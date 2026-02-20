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

type Params = Record<string, string | string[] | undefined>;

export type SidebarLinkItem = {
  title: string;
  url: Route | ((params: Params) => Route);
  icon: Icon;
  tooltip?: React.ReactNode;
  exact?: boolean; // Default is true
};
export type SidebarLabel = { title: string };
export type SidebarItem = SidebarLabel | SidebarLinkItem;

type SidebarConfig = {
  include: string[];
  exclude?: string[];
  content: SidebarItem[];
};

const globalExclude = [
  "a^", // This will never match anything
  "^/dashboard/canva/.*$",
];

const sidebarConfig: SidebarConfig[] = [
  {
    include: ["^/dashboard/audits/.*$"],
    content: [
      { title: "Audit Dashboard", url: "/dashboard/audits", icon: Scan },
      { title: "Overview" },
      {
        title: "Case Dashboard",
        url: (params) => `/dashboard/audits/${params.auditId}/case` as Route,
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
      {
        title: "Team",
        url: "#",
        icon: People,
      },
    ],
  },
  {
    include: ["^/dashboard/.*$"],
    content: [
      { title: "Audit Dashboard", url: "/dashboard/audits", icon: Scan },
      {
        title: "Resources",
        url: "/dashboard/resources",
        icon: Shop,
      },
      {
        title: "Team",
        url: "/dashboard/teams",
        icon: People,
      },
      {
        title: "Agentic SDK's",
        url: "#",
        icon: CodeCircle,
        tooltip: "Coming Soon",
      },
    ],
  },
];

/**
 * Returns the sidebar content for the matched pathname or pattern
 * @param pathname A regex pattern or the pathname to match
 * @returns Sidebar content for the matched pathname or pattern
 */
export const getSidebarContent = (pathname: string, params: Params) => {
  const matchedConfig = sidebarConfig.find((config) => {
    const includeRegExp = new RegExp(config.include.join("|"));
    const excludeRegExp = new RegExp(
      [...globalExclude, ...(config.exclude || [])].join("|"),
    );

    return includeRegExp.test(pathname) && !excludeRegExp.test(pathname);
  });

  if (!matchedConfig) return null;

  // Inject params to urls
  const injectedContent = matchedConfig.content.map((item) => {
    if (!("url" in item)) return item;
    return {
      ...item,
      url: typeof item.url === "function" ? item.url(params) : item.url,
    };
  });

  return injectedContent;
};
