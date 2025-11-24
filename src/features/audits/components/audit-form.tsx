"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { HayaSpinner } from "@/components/ui/spinner";
import { useCreateAudit } from "../audit.hook";
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
              <Input {...form.register("url")} />
              <FieldError errors={[form.formState.errors.url]} />
            </Field>
            <Button size="lg">Audit now</Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
};
