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
};

const defaultSidebarContent = {
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
    {
      title: "Agents",
      url: "/dashboard/agents",
      icon: Code,
    },
    {
      title: "Personas",
      url: "#",
      icon: Personalcard,
      tooltip: "Coming Soon",
    },
    {
      title: "Team",
      url: "/dashboard/teams",
      icon: People,
    },
  ],
};

/**
 * Provider might not even be needed but leaving it for now
 */
const SidebarContentContext = createContext<SidebarContentState>(
  defaultSidebarContent,
);

/**
 * A store that stores sidebarContents as a stack.
 * It is used internally because of react context limitations.
 * React context can only provide values to children and when children are nested, it doesnt provide values up the tree. consider this
 * There is a program with using context to set sidebar contents. imagine this scenario
 *
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
  () => ({
    stack: [defaultSidebarContent],
  }),
);

export const useSidebarContent = (): SidebarContentState => {
  const context = useContext(SidebarContentContext);
  const sidebarStack = useSidebarContentStore((state) => state.stack);

  if (!context) {
    throw new Error(
      "useSidebarContent must be used within a SidebarContentProvider.",
    );
  }

  // return context;
  // instead of returning the context value, return the last item in the stack
  return sidebarStack[sidebarStack.length - 1];
};

export const SidebarContentProvider = ({
  children,
  value = defaultSidebarContent,
}: {
  children: React.ReactNode;
  value?: SidebarContentState;
}) => {
  // Push the sidebarContent value to the sidebarContentStore stack and pop it off when component unmounts
  useEffect(() => {
    useSidebarContentStore.setState((state) => ({
      stack: [...state.stack, value],
    }));

    return () => {
      useSidebarContentStore.setState((state) => ({
        stack: state.stack.slice(0, -1),
      }));
    };
  }, [value]);

  return (
    <SidebarContentContext.Provider value={value}>
      {children}
    </SidebarContentContext.Provider>
  );
};
