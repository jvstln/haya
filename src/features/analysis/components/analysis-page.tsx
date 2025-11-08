"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AttachCircle } from "iconsax-reactjs";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { newAnalysisSchema } from "@/features/analysis/analysis.schema";
import type {
  AnalysisMode,
  NewAnalysis,
} from "@/features/analysis/analysis.type";
import { cn } from "@/lib/utils";
import {
  useAnalysis,
  useCreateAnalysis,
} from "@/features/analysis/analysis.api";
import { toast } from "sonner";
import Link from "next/link";

const analysisModeLabel: Record<AnalysisMode, string> = {
  web: "Website Analysis",
  webVsUi: "UI vs Website Analysis",
  webVsWeb: "Website vs Website Analysis",
};

export const AnalysisPage = () => {
  const router = useRouter();
  const createAnalysis = useCreateAnalysis();

  const form = useForm({
    resolver: zodResolver(newAnalysisSchema),
    defaultValues: {
      mode: "web",
      urls: ["", ""],
    },
  });

  const mode = form.watch("mode");
  const isSubmitting = form.formState.isSubmitting || createAnalysis.isPending;

  const handleSubmit = (values: NewAnalysis) => {
    createAnalysis.mutate(values, {
      onSuccess(data) {
        router.push(`/dashboard/analyze/cases/${data._id}`);
      },
    });
  };

  return (
    <div className="flex h-full w-full flex-col items-center space-y-7 p-5">
      <Button variant="outline" asChild>
        <Link href="/dashboard/analyze/cases" className="self-end">
          View all cases
        </Link>
      </Button>
      <div className="max-w-150 space-y-5 text-center max-sm:my-auto sm:mt-31.5 md:mt-39.25">
        <h1 className="bg-(image:--colorful-gradient) bg-clip-text p-1 font-bold text-2xl text-transparent md:text-4xl">
          Let&apos;s get straight to work
        </h1>
        <p className="max-md:text-sm">
          Seamless infrastructure for onchain UX analytics, empowering builders
          to identify and fix friction points in minutes, not weeks.
        </p>
      </div>

      <ScrollArea className="w-full max-w-201 pb-2.5">
        <Controller
          name="mode"
          control={form.control}
          render={({ field }) => (
            <div className="flex justify-center gap-4">
              {Object.entries(analysisModeLabel).map(([mode, label]) => (
                <Button
                  key={mode}
                  variant="ghost"
                  className={cn(
                    "shrink text-sm max-sm:p-2 lg:text-base",
                    mode === field.value &&
                      "border-primary border-b-4 bg-border"
                  )}
                  onClick={() => field.onChange(mode)}
                >
                  {label}
                </Button>
              ))}
            </div>
          )}
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="w-full max-w-201 space-y-2">
        {mode === "webVsWeb" ? (
          <div className="flex flex-col gap-4">
            <Controller
              name="urls.0"
              control={form.control}
              render={({ field, fieldState }) => (
                <Input
                  data-size="lg"
                  placeholder="Enter your website URL"
                  {...field}
                  value={String(field.value)}
                  aria-invalid={fieldState.invalid}
                />
              )}
            />
            <Controller
              name="urls.1"
              control={form.control}
              render={({ field, fieldState }) => (
                <Input
                  data-size="lg"
                  placeholder="Enter your website URL"
                  {...field}
                  value={String(field.value)}
                  aria-invalid={fieldState.invalid}
                />
              )}
            />
            <Button
              variant="colorful"
              size="lg"
              onClick={form.handleSubmit(handleSubmit)}
              isLoading={isSubmitting}
              loadingText="Analyzing..."
            >
              Analyze competitors
            </Button>
          </div>
        ) : (
          <InputGroup className="">
            <Controller
              name="urls.0"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroupInput
                    placeholder="Enter your website URL"
                    {...field}
                    value={String(field.value)}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />
            <InputGroupAddon align="block-end">
              {mode === "webVsUi" && (
                <Button variant="outline" className="">
                  <AttachCircle />
                  Attach visual
                </Button>
              )}
              <Button
                variant="colorful"
                className="ml-auto"
                onClick={form.handleSubmit(handleSubmit)}
                isLoading={isSubmitting}
                loadingText="Analyzing..."
              >
                Analyze
              </Button>
            </InputGroupAddon>
          </InputGroup>
        )}
        <FieldError errors={Object.values(form.formState.errors).flat()} />
      </div>
    </div>
  );
};
