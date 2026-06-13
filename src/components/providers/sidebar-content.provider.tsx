import {
  Category,
  Code,
  People,
  Personalcard,
  Radar,
  Routing,
} from "iconsax-reactjs";
import type { Route } from "next";
import { createContext, useContext, useEffect } from "react";
import { create } from "zustand";
import type { Icon } from "@/components/icons";

type SidebarContentItem =
  | {
      title: string;
      url: Route;
      icon: Icon;
      tooltip?: React.ReactNode;
      getIsActive?: (currentPath: string) => boolean;
    }
  | { title: string }
  | React.ReactNode;

export type SidebarContentState = {
  content: SidebarContentItem[];
  depth: number;
};

export const defaultSidebarContent = {
  content: [
    {
      title: "Get Started",
      url: "/dashboard/get-started",
      icon: Routing,
    },
    {
      title: "Dashboard",
      url: "/dashboard/projects",
      icon: Category,
    },
    {
      title: "Track Experience",
      url: "/dashboard/track-experience",
      icon: Radar,
    },
    // {
    //   title: "Team",
    //   url: "/dashboard/teams",
    //   icon: People,
    // },
  ],
  depth: -1,
} satisfies SidebarContentState;

/**
 * Context used to determine which sidebar content to use. Context with the highest depth wins.
 */
const SidebarContentContext = createContext<{ depth: number }>({ depth: -1 });

/**
 * A store that stores sidebarContents with the depth provided by the SidebarContentContext.
 *
 * @example
 * dashboard/layout.tsx
 * <SidebarProvider value={dashboardSidebarContent}>
 *   <AppSidebar/> // renders the sidebar content and consumes sidebarContent value
 *   {children}
 * </SidebarProvider>
 *
 * dashboard/projects/[projectId]/layout.tsx
 * // gets nested in /dashboard/layout.tsx and loses/fails to provide sidebarContent value
 * <SidebarProvider value={projectSidebarContent}>{children}</SidebarProvider>
 *
 */
const useSidebarContentStore = create<{ stack: SidebarContentState[] }>()(
  () => ({ stack: [] }),
);

export const useSidebarContent = (): SidebarContentState => {
  const sidebarContentStore = useSidebarContentStore();

  let contentWithMaxDepth: SidebarContentState = defaultSidebarContent;
  sidebarContentStore.stack.forEach((sidebarContent) => {
    if (sidebarContent.depth > contentWithMaxDepth.depth) {
      contentWithMaxDepth = sidebarContent;
    }
  });

  return contentWithMaxDepth;
};

export const SidebarContentProvider = ({
  children,
  value = defaultSidebarContent,
}: {
  children: React.ReactNode;
  value?: Omit<SidebarContentState, "depth">;
}) => {
  const { depth: parentDepth } = useContext(SidebarContentContext);
  const depth = parentDepth + 1;

  // add the sidebarContent value to the sidebarContentStore and remove it when component unmounts
  useEffect(() => {
    const newContent = { ...value, depth };

    useSidebarContentStore.setState((state) => ({
      stack: [...state.stack, newContent],
    }));

    return () => {
      useSidebarContentStore.setState((state) => ({
        stack: state.stack.filter((s) => s !== newContent),
      }));
    };
  }, [value, depth]);

  return (
    <SidebarContentContext.Provider value={{ depth }}>
      {children}
    </SidebarContentContext.Provider>
  );
};
