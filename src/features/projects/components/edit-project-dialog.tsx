"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useUpdateProject } from "../project.hook";
import { projectSettingsSchema } from "../project.schema";
import type { Project, ProjectSettings } from "../project.type";

interface EditProjectProps {
  project: Project;
  onClose: () => void;
}

export const EditProjectDialogForm = ({
  project,
  onClose,
}: EditProjectProps) => {
  const updateProjectMutation = useUpdateProject();
  const form = useForm({
    resolver: zodResolver(projectSettingsSchema),
    defaultValues: {
      name: project.name,
      domain: project.domain,
      isActive: project.isActive,
      settings: {
        sessionReplay: project.settings?.sessionReplay ?? false,
        heatmaps: project.settings?.heatmaps ?? false,
        trackClicks: project.settings?.trackClicks ?? false,
        trackScrolls: project.settings?.trackScrolls ?? false,
        trackMousemove: project.settings?.trackMousemove ?? false,
        maskInputs: project.settings?.maskInputs ?? false,
      },
    },
  });

  const onSubmit = async (data: ProjectSettings & { isActive?: boolean }) => {
    updateProjectMutation.mutate(
      {
        _id: project._id,
        ...data,
      },
      {
        onSuccess() {
          onClose();
        },
      },
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="edit-name">Project Name</FieldLabel>
          <FieldContent>
            <Input
              id="edit-name"
              placeholder="e.g. Haya App"
              {...form.register("name")}
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="edit-domain">Project URL</FieldLabel>
          <FieldContent>
            <Input
              id="edit-domain"
              placeholder="e.g. https://example.com"
              {...form.register("domain")}
            />
          </FieldContent>
        </Field>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <span className="font-semibold text-sm">
          SDK Data Collection Active
        </span>
        <Switch
          checked={form.watch("isActive")}
          onCheckedChange={(checked) => form.setValue("isActive", checked)}
        />
      </div>

      <div className="border-t pt-4">
        <h4 className="mb-4 font-semibold text-sm">
          SDK Behavior Capturing Controls
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="/20 flex items-center justify-between rounded-xl border p-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-xs">Session Replay</span>
              <span className="text-[10px]">
                Record full user interaction videos
              </span>
            </div>
            <Switch
              checked={form.watch("settings.sessionReplay")}
              onCheckedChange={(checked) =>
                form.setValue("settings.sessionReplay", checked)
              }
            />
          </div>

          <div className="/20 flex items-center justify-between rounded-xl border p-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-xs">Heatmaps</span>
              <span className="text-[10px]">
                Aggregate user clicks & scrolls visually
              </span>
            </div>
            <Switch
              checked={form.watch("settings.heatmaps")}
              onCheckedChange={(checked) =>
                form.setValue("settings.heatmaps", checked)
              }
            />
          </div>

          <div className="/20 flex items-center justify-between rounded-xl border p-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-xs">Track Click Actions</span>
              <span className="text-[10px]">
                Automatically log interactive clicks
              </span>
            </div>
            <Switch
              checked={form.watch("settings.trackClicks")}
              onCheckedChange={(checked) =>
                form.setValue("settings.trackClicks", checked)
              }
            />
          </div>

          <div className="/20 flex items-center justify-between rounded-xl border p-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-xs">Track Scroll Activity</span>
              <span className="text-[10px]">
                Capture vertical page scroll depth
              </span>
            </div>
            <Switch
              checked={form.watch("settings.trackScrolls")}
              onCheckedChange={(checked) =>
                form.setValue("settings.trackScrolls", checked)
              }
            />
          </div>

          <div className="/20 flex items-center justify-between rounded-xl border p-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-xs">
                Track Cursor Movements
              </span>
              <span className="text-[10px]">
                Record exact pointer trace paths
              </span>
            </div>
            <Switch
              checked={form.watch("settings.trackMousemove")}
              onCheckedChange={(checked) =>
                form.setValue("settings.trackMousemove", checked)
              }
            />
          </div>

          <div className="/20 flex items-center justify-between rounded-xl border p-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-xs">Mask Input Elements</span>
              <span className="text-[10px]">
                Obfuscate user field text securely
              </span>
            </div>
            <Switch
              checked={form.watch("settings.maskInputs")}
              onCheckedChange={(checked) =>
                form.setValue("settings.maskInputs", checked)
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-end gap-3 border-t pt-4">
        <Button
          type="button"
          appearance="ghost"
          color="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={updateProjectMutation.isPending}>
          Save changes
        </Button>
      </div>
    </form>
  );
};
