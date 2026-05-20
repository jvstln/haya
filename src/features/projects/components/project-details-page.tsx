"use client";

import { Settings } from "lucide-react";
import {
  DashboardDescription,
  DashboardHeader,
  DashboardSlot,
  DashboardTitle,
} from "@/components/dashboard-ui";
import { QueryState } from "@/components/query-states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "../project.hook";
import { ProjectOverview } from "./project-overview";

interface ProjectDetailsPageProps {
  projectId: string;
}

export const ProjectDetailsPage = ({ projectId }: ProjectDetailsPageProps) => {
  const project = useProject(projectId);

  const isLoading = project.isLoading;
  const isError = project.isError;

  if (isError) {
    return <QueryState query={project} />;
  }

  return (
    <DashboardSlot>
      {/* Header section */}
      <DashboardHeader className="flex-row flex-wrap gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          {project.isPending ? (
            <>
              <Skeleton className="h-6 w-36 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </>
          ) : project.isError ? (
            <QueryState query={project} />
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2.5">
                <DashboardTitle className="max-w-xs truncate md:max-w-md">
                  {project.data.name}
                </DashboardTitle>
                <Badge variant={project.data.isActive ? "default" : "outline"}>
                  {project.data.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <DashboardDescription>
                <a
                  href={project.data.domain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate"
                  data-slot="link"
                >
                  {project.data.domain}
                </a>
              </DashboardDescription>
            </>
          )}
        </div>

        <div className="ml-auto flex flex-col gap-6 self-end">
          {/* Header Actions */}
          {!isLoading && project && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                href={`/dashboard/projects/${projectId}/settings`}
                size="sm"
                appearance="outline"
                color="secondary"
              >
                <Settings />
                Configure
              </Button>
            </div>
          )}
        </div>
      </DashboardHeader>

      <ProjectOverview projectId={projectId} />
    </DashboardSlot>
  );
};
