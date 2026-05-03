"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, StepperButton } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { HayaSpinner, Spinner } from "@workspace/ui/components/spinner";
import { useCreateAudit, usePreAuditInfo } from "../audit.hook";
import { newAuditSchema } from "../audit.schema";
import type { NewAudit } from "../audit.type";

export const NewAuditForm = ({
  children,
  open: controlledOpen,
  ...props
}: React.ComponentProps<typeof Dialog>) => {
  const [_open, _setOpen] = useState(false);
  const createAudit = useCreateAudit();
  const router = useRouter();

  const form = useForm<NewAudit>({
    defaultValues: { url: "" },
    resolver: zodResolver(newAuditSchema),
  });

  const url = form.watch("url");
  const pageCount = form.watch("pageCount");
  const isUrlValid = newAuditSchema.shape.url.safeParse(url).success;

  const preAuditInfo = usePreAuditInfo({ url: isUrlValid ? url : "" });

  useEffect(() => {
    if (!preAuditInfo.data?.rootUrl) return;

    form.setValue("pageCount", preAuditInfo.data.pageCount);
  }, [preAuditInfo.data?.rootUrl, preAuditInfo.data?.pageCount, form.setValue]);

  const open = controlledOpen ?? _open;
  const setOpen = (open: boolean) => {
    _setOpen(open);
    props.onOpenChange?.(open);
  };

  const handleSubmit = (values: NewAudit) => {
    createAudit.mutate(values, {
      onSuccess(data) {
        router.push(`/dashboard/audits/${data?._id}`);
      },
    });
  };

  const isLoading = form.formState.isSubmitting || createAudit.isPending;

  console.log(preAuditInfo.data);

  return (
    <Dialog {...props} open={isLoading ? true : open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {isLoading ? (
        <DialogContent
          className="flex min-h-80 flex-col items-center justify-center **:data-[slot=loader]:my-auto"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, oklch(from var(--color-primary) l c h / 0.2), transparent), var(--color-background)",
          }}
        >
          <HayaSpinner />
          <span className="text-sm">Running your audit</span>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-foreground text-h1">
              Perform a UX Audit
            </DialogTitle>
            <DialogDescription>
              Spot Ux friction before your users does.
            </DialogDescription>
          </DialogHeader>

          <form
            className="mt-10 flex flex-col gap-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <Field data-invalid={!!form.formState.errors.url}>
              <FieldLabel>Website URL</FieldLabel>
              <Input
                {...form.register("url")}
                aria-invalid={!!form.formState.errors.url}
                placeholder="Enter link"
              />
              <FieldError errors={[form.formState.errors.url]} />
            </Field>

            <Field>
              <FieldLabel>
                Total Cost
                {preAuditInfo.isPending ? <Spinner /> : null}
              </FieldLabel>

              <div className="relative flex flex-col gap-4 rounded-2xl border bg-[#060607] p-6 shadow-inner">
                {preAuditInfo.isError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-none bg-inherit text-destructive">
                    Failed to load website data
                    <Button
                      size="sm"
                      type="button"
                      appearance="outline"
                      color="secondary"
                    >
                      Retry
                    </Button>
                  </div>
                ) : null}

                <div className="flex items-baseline gap-2">
                  <span className="text-muted-foreground text-xl">$</span>
                  <span className="font-bold text-white text-xl">
                    {preAuditInfo.data && pageCount
                      ? preAuditInfo.data.pricing.pricePerPage * pageCount
                      : "-"}
                  </span>
                </div>

                <hr />

                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">Pages</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xl">
                        {pageCount || "-"} pages
                      </span>
                    </div>
                  </div>
                  <StepperButton
                    onClick={(_, count) => {
                      if (!preAuditInfo.data) return;

                      form.setValue(
                        "pageCount",
                        (form.getValues("pageCount") || 0) + count,
                      );
                    }}
                  />
                </div>
              </div>
            </Field>

            <Button size="lg">Audit now</Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
};
