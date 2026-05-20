"use client";

import { Code2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  DashboardDescription,
  DashboardHeader,
  DashboardSlot,
  DashboardTitle,
} from "@/components/dashboard-ui";
import { QueryState } from "@/components/query-states";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/ui/dialog-confirmation";
import { useDeleteProject, useProject } from "../project.hook";
import type { Project } from "../project.type";
import { EditProjectDialogForm } from "./edit-project-dialog";
import { SdkInstallationInstruction } from "./sdk-installation-instruction";

interface ProjectSettingsPageProps {
  projectId: string;
}

type Action = {
  type: "setupInstruction" | "delete";
  // project: Project;
};

export const ProjectSettingsPage = ({
  projectId,
}: ProjectSettingsPageProps) => {
  const router = useRouter();

  const projectQuery = useProject(projectId);
  const deleteProjectMutation = useDeleteProject();

  const [action, setAction] = useState<Action | null>(null);

  return (
    <DashboardSlot>
      <DashboardHeader>
        <DashboardTitle>Project Settings</DashboardTitle>
        <DashboardDescription>
          Manage your product keys, recording capturing controls, and deletion
          options.
        </DashboardDescription>
      </DashboardHeader>

      <QueryState query={projectQuery}>
        {() => {
          const project = projectQuery.data as Project;

          return (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column (span 2): Capture & General Settings Form */}
              <div className="flex flex-col gap-6 lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>General & Capture Controls</CardTitle>
                    <CardDescription>
                      Update your product information and toggle active capture
                      options.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EditProjectDialogForm
                      project={project}
                      onClose={() => {
                        toast.success("Project settings saved!");
                        projectQuery.refetch();
                      }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column (span 1): SDK Key & Danger Zone */}
              <div className="flex flex-col gap-6">
                {/* SDK Key Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tracking SDK Key</CardTitle>
                    <CardDescription>
                      Unique SDK product key for capturing web analytics.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <CodeBlock language="plaintext" code={project.sdkKey} />

                    <Button
                      onClick={() => setAction({ type: "setupInstruction" })}
                      appearance="soft"
                      color="primary"
                      className="w-full"
                    >
                      <Code2 />
                      View Setup Instructions
                    </Button>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive/30">
                  <CardHeader>
                    <CardTitle className="text-destructive">
                      Danger Zone
                    </CardTitle>
                    <CardDescription>
                      Irreversible actions related to this registered product.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-xs">
                      Deleting this project will permanently remove all visual
                      sessions, heatmaps, clicks, and captured data.
                    </p>
                    <Button
                      onClick={() => setAction({ type: "delete" })}
                      appearance="solid"
                      color="destructive"
                      className="w-full"
                    >
                      <Trash2 />
                      Delete Project Permanently
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Setup Guide Dialog */}
              <Dialog
                open={action?.type === "setupInstruction"}
                onOpenChange={(open) => !open && setAction(null)}
              >
                <DialogContent className="h-full">
                  <DialogHeader>
                    <DialogTitle>
                      Setup Behavioral Analytics for {project.name}
                    </DialogTitle>
                    <DialogDescription>
                      Follow instructions to integrate Haya SDK with your client
                      app.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <SdkInstallationInstruction sdkKey={project.sdkKey} />
                  </div>
                </DialogContent>
              </Dialog>

              {action?.type === "delete" && (
                <ConfirmationDialog
                  open={true}
                  onOpenChange={(open) => !open && setAction(null)}
                  title="Delete Project permanently?"
                  description="This action is irreversible. All behavioral sessions, heatmaps, and analytics associated with this product key will be permanently removed."
                  buttonText="Delete permanently"
                  onConfirm={async () => {
                    await deleteProjectMutation.mutateAsync(projectId);
                    router.push("/dashboard/projects");
                  }}
                />
              )}
            </div>
          );
        }}
      </QueryState>
    </DashboardSlot>
  );
};
