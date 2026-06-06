"use client";
import { ArrowLeft2, Eye, MouseSquare } from "iconsax-reactjs";
import { Settings } from "lucide-react";
import type { Route } from "next";
import { useParams } from "next/navigation";
import {
  SidebarContentProvider,
  type SidebarContentState,
} from "@/components/providers/sidebar-content.provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/features/projects/project.hook";

export default function ProjectsLayout({
  children,
}: LayoutProps<"/dashboard/projects/[projectId]">) {
  const { projectId } =
    useParams<
      Awaited<LayoutProps<"/dashboard/projects/[projectId]">["params"]>
    >();

  const project = useProject(projectId);

  const sidebarContent: Omit<SidebarContentState, "depth"> = {
    content: [
      project.data ? (
        <div
          key="title"
          className="flex min-w-0 items-center gap-3 rounded-sm bg-background/50 p-4"
        >
          <Button
            href="/dashboard/projects"
            size="icon-sm"
            appearance="outline"
            color="secondary"
          >
            <ArrowLeft2 />
          </Button>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-bold text-foreground text-sm">
              {project.data.name}
            </span>
            <span className="truncate text-muted-foreground text-xs">
              {project.data.domain}
            </span>
          </div>
        </div>
      ) : (
        <Skeleton
          key="pending-title"
          className="flex h-16 min-w-0 items-center gap-3 rounded-sm bg-background/50 p-4"
        />
      ),
      {
        title: "Overview",
        url: `/dashboard/projects/${projectId}` as Route,
        icon: Eye,
        getIsActive: (pathname) =>
          pathname === `/dashboard/projects/${projectId}`,
      },
      {
        title: "Sessions",
        url: `/dashboard/projects/${projectId}/sessions` as Route,
        icon: MouseSquare,
      },
      {
        title: "Settings",
        url: `/dashboard/projects/${projectId}/settings` as Route,
        icon: Settings,
      },
    ],
  };

  return (
    <SidebarContentProvider value={sidebarContent}>
      {children}
    </SidebarContentProvider>
  );
}
