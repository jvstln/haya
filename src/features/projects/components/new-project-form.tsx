"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Stepper, StepperRail, StepperStep } from "@/components/ui/stepper";
import { useCreateProject } from "../project.hook";
import { newProjectSchema } from "../project.schema";
import type { NewProject, Project } from "../project.type";
import { SdkInstallationInstruction } from "./sdk-installation-instruction";

const STEPS = [
  { label: "Create Project" },
  { label: "Install & Integrate" },
  { label: "Verify Integration" },
];

interface NewProjectFormProps {
  onSuccess?: () => void;
}

export const NewProjectForm = ({ onSuccess }: NewProjectFormProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [projectData, setProjectData] = useState<Project | null>(null);
  const createProjectMutation = useCreateProject();

  const handleStepOneSubmit = async (values: NewProject) => {
    createProjectMutation.mutate(values, {
      onSuccess(data) {
        setProjectData(data);
        setCurrentStepIndex(1);
      },
    });
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-bold text-foreground text-h3">
          Set Up Behavioral Tracking SDK
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Connect the Haya SDK to your product to capture real user behavior,
          analyze user journeys, and generate AI-powered insights that help
          improve conversion, engagement, and retention.
        </p>
      </div>

      <Stepper
        step={currentStepIndex}
        onStepChange={(step) => {
          if (step < currentStepIndex) {
            setCurrentStepIndex(step);
          }
        }}
        className="mb-8"
      >
        {STEPS.map((_step, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: steps are static and ordered
          <StepperStep key={i}>
            <StepperRail />
          </StepperStep>
        ))}
      </Stepper>

      {currentStepIndex === 0 && (
        <StepOne
          onSubmit={handleStepOneSubmit}
          isPending={createProjectMutation.isPending}
        />
      )}
      {currentStepIndex === 1 && (
        <StepTwo
          project={projectData}
          onBack={() => setCurrentStepIndex(0)}
          onNext={() => setCurrentStepIndex(2)}
        />
      )}
      {currentStepIndex === 2 && (
        <StepThree
          onBack={() => setCurrentStepIndex(1)}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
};

// ─── Step One: Create Project Form ───────────────────────────────────────────

interface StepOneProps {
  onSubmit: (data: NewProject) => void;
  isPending: boolean;
}

const StepOne = ({ onSubmit, isPending }: StepOneProps) => {
  const form = useForm({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      name: "",
      domain: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Project</CardTitle>
        <CardDescription>
          Give your project a name to start tracking user behavior, uncover
          friction points, and discover growth opportunities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <Field>
            <FieldLabel htmlFor="project-name">Name Project</FieldLabel>
            <FieldContent>
              <Input
                id="project-name"
                placeholder="e.g. Haya Website, SaaS Dashboard, Mobile App"
                {...form.register("name")}
                aria-invalid={form.formState.errors.name ? "true" : "false"}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="project-url">Project URL</FieldLabel>
            <FieldContent>
              <Input
                id="project-url"
                placeholder="e.g. https://example.com"
                {...form.register("domain")}
                aria-invalid={form.formState.errors.domain ? "true" : "false"}
              />
              <FieldError errors={[form.formState.errors.domain]} />
            </FieldContent>
          </Field>

          <div className="mt-2 flex justify-end border-zinc-800 border-t pt-4">
            <Button type="submit" isLoading={isPending}>
              Continue
              <ArrowRight />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// ─── Step Two: Sdk Installation Guide ────────────────────────────────────────

interface StepTwoProps {
  project: Project | null;
  onBack: () => void;
  onNext: () => void;
}

const StepTwo = ({ project, onBack, onNext }: StepTwoProps) => {
  return (
    <Card className="max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:hover:bg-transparent">
      <CardHeader>
        <CardTitle className="text-xl">Integrate Haya in Minutes</CardTitle>
        <CardDescription>
          Follow these simple steps to connect Haya to your product and start
          collecting behavioral data.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <SdkInstallationInstruction sdkKey={project?.sdkKey} />

        <div className="flex items-center justify-between border-zinc-800 border-t pt-4">
          <Button
            onClick={onBack}
            appearance="ghost"
            className="cursor-pointer"
          >
            Back
          </Button>
          <Button onClick={onNext} className="cursor-pointer">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Step Three: Verify Connection ───────────────────────────────────────────

interface StepThreeProps {
  onBack: () => void;
  onSuccess?: () => void;
}

const StepThree = ({ onBack, onSuccess }: StepThreeProps) => {
  const [status, setStatus] = useState<"idle" | "listening" | "success">(
    "listening",
  );

  useEffect(() => {
    if (status === "listening") {
      const timer = setTimeout(() => setStatus("success"), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleFinish = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      window.location.href = "/dashboard/projects";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify SDK Integration</CardTitle>
        <CardDescription>
          Run your application and trigger a few user actions. Haya will
          automatically detect incoming events and verify your SDK connection in
          real-time.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-8 text-center">
          {status === "listening" && (
            <>
              <div className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-12 w-12 animate-ping rounded-full bg-primary/20 opacity-75" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
                  <Activity className="h-6 w-6 animate-pulse text-primary" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-sm text-zinc-200">
                  Listening for integration events...
                </p>
                <p className="text-xs text-zinc-500">
                  Please start your app and trigger event actions.
                </p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-success/40 bg-success/10 text-success">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-sm text-zinc-100">
                  SDK Connected Successfully!
                </p>
                <p className="text-xs text-zinc-500">
                  Successfully received first event: page_view
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-zinc-800 border-t pt-4">
          <Button
            onClick={onBack}
            appearance="ghost"
            className="cursor-pointer"
          >
            Back
          </Button>
          <Button
            onClick={handleFinish}
            disabled={status !== "success"}
            className="flex cursor-pointer items-center gap-1.5"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
