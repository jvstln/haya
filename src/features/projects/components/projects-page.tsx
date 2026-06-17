"use client";

import { Plus } from "lucide-react";
import { Suspense, useState } from "react";
import {
  DashboardHeader,
  DashboardSlot,
  DashboardTitle,
} from "@/components/dashboard-ui";
import { QueryState } from "@/components/query-states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/ui/dialog-confirmation";
import { InputSearch } from "@/components/ui/input-search";
import { HayaSpinner } from "@/components/ui/spinner";
import { useFilters } from "@/hooks/use-filters";
import { useDeleteProject, useProjects } from "../project.hook";
import type { Project, ProjectFilters } from "../project.type";
import { EditProjectDialogForm } from "./edit-project-dialog";
import { NewProjectForm } from "./new-project-form";
import { ProjectCard } from "./project-card";
import { SdkInstallationInstruction } from "./sdk-installation-instruction";

const ProjectsPage = () => {
  const { filters, setFilters, originalFilters } = useFilters<ProjectFilters>();
  const projectsQuery = useProjects(filters);
  const deleteProjectMutation = useDeleteProject();

  const [createOpen, setCreateOpen] = useState(false);
  const [setupProject, setSetupProject] = useState<Project | null>(null);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const searchLower = (originalFilters.search || "").toLowerCase();
  const projects =
    projectsQuery.data?.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.domain.toLowerCase().includes(searchLower),
    ) ?? [];

  return (
    <DashboardSlot>
      <DashboardHeader>
        <DashboardTitle>
          Manage your products, obtain SDK tracking keys, and configure
          recording insights
        </DashboardTitle>
        <Button
          onClick={() => setCreateOpen(true)}
          className="animate-border-glow rounded-full"
        >
          <Plus />
          Create project
        </Button>
      </DashboardHeader>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge color="secondary" className="rounded-full">
            {projectsQuery.data ? `${projects.length} total` : "Loading..."}
          </Badge>
        </div>

        <InputSearch
          placeholder="Search projects..."
          value={originalFilters.search}
          onChange={(e) => {
            setFilters((f) => ({ ...f, search: e.target.value }));
          }}
          className="max-w-xs"
        />
      </div>

      <QueryState query={projectsQuery}>
        {projects.length === 0 ? (
          <QueryState
            query={{}}
            getIsEmpty={() => ({
              title: "No projects found",
              description:
                "Create a project to obtain an SDK tracking key and configure tracking settings.",
              cta: (
                <Button
                  onClick={() => setCreateOpen(true)}
                  appearance="outline"
                  color="secondary"
                >
                  Create your first project
                </Button>
              ),
            })}
          />
        ) : (
          <div className="flex flex-wrap gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onSetup={setSetupProject}
                onConfigure={setEditProject}
                onDelete={setDeleteProjectId}
              />
            ))}
          </div>
        )}
      </QueryState>

      {/* dialog for creating a project */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="h-full">
          <NewProjectForm
            onSuccess={() => {
              setCreateOpen(false);
              projectsQuery.refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* dialog for sdk setup instructions */}
      <Dialog
        open={!!setupProject}
        onOpenChange={(open) => !open && setSetupProject(null)}
      >
        <DialogContent className="h-full">
          {setupProject && (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl">
                  Setup Behavioral Analytics for {setupProject.name}
                </DialogTitle>
                <DialogDescription>
                  Follow these instructions to integrate the Haya SDK with your
                  platform.
                </DialogDescription>
              </DialogHeader>
              <div className="pb-4">
                <SdkInstallationInstruction sdkKey={setupProject.sdkKey} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* dialog for project configuration settings */}
      <Dialog
        open={!!editProject}
        onOpenChange={(open) => !open && setEditProject(null)}
      >
        <DialogContent className="max-w-2xl bg-zinc-950 p-6 md:p-8">
          {editProject && (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl">
                  Configure {editProject.name}
                </DialogTitle>
                <DialogDescription>
                  Modify the product registration properties or toggle active
                  behavioral recording options.
                </DialogDescription>
              </DialogHeader>
              <EditProjectDialogForm
                project={editProject}
                onClose={() => {
                  setEditProject(null);
                  projectsQuery.refetch();
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* confirmation dialog for deleting a project */}
      {deleteProjectId && (
        <ConfirmationDialog
          open={true}
          onOpenChange={(open) => !open && setDeleteProjectId(null)}
          title="Delete Project permanently?"
          description="This action is irreversible. All behavioral sessions, heatmaps, and analytics associated with this product key will be permanently removed."
          buttonText="Delete permanently"
          onConfirm={async () => {
            await deleteProjectMutation.mutateAsync(deleteProjectId);
            setDeleteProjectId(null);
          }}
        />
      )}
    </DashboardSlot>
  );
};

// ─── Suspense Wrapper ────────────────────────────────────────────────────────

const ProjectsPageSuspenseWrapper = () => {
  return (
    <Suspense
      fallback={
        <div className="grid size-full min-h-60 place-content-center">
          <HayaSpinner />
        </div>
      }
    >
      <ProjectsPage />
    </Suspense>
  );
};

export { ProjectsPageSuspenseWrapper as ProjectsPage };
