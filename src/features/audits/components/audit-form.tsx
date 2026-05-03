"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown2, ArrowUp2 } from "iconsax-reactjs";
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
import { Label } from "@/components/ui/label";
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
              <Input
                {...form.register("url")}
                aria-invalid={!!form.formState.errors.url}
                placeholder="Enter link"
              />
              <FieldError errors={[form.formState.errors.url]} />
            </Field>
            <Button size="lg">Audit now</Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export const PayPerAuditForm = ({
  children,
  ...props
}: React.ComponentProps<typeof Dialog>) => {
  const [_open, _setOpen] = useState(false);
  const [pages, setPages] = useState(10);
  const createAudit = useCreateAudit();
  const router = useRouter();

  const form = useForm<NewAudit>({
    defaultValues: { url: "" },
    resolver: zodResolver(newAuditSchema),
  });

  const open = props.open ?? _open;
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

  const cost = pages * 2;
  const isLoading = form.formState.isSubmitting || createAudit.isPending;

  return (
    <Dialog {...props} open={isLoading ? true : open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {isLoading ? (
        <DialogContent className="flex min-h-80 flex-col items-center justify-center">
          <HayaSpinner />
          <p className="animate-pulse text-muted-foreground text-sm">
            Processing payment and starting audit...
          </p>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader className="space-y-1">
            <DialogTitle className="font-semibold text-3xl text-white">
              Pay Per Audit
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              We are flexible, we charge as low as $2 per page audit.
            </DialogDescription>
          </DialogHeader>

          <form
            className="mt-8 flex flex-col gap-8"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <Field data-invalid={!!form.formState.errors.url}>
              <FieldLabel className="text-muted-foreground">
                Website/Webapp URL
              </FieldLabel>
              <Input
                {...form.register("url")}
                placeholder="Enter link"
                className="h-14 border-muted/20 bg-muted/5 text-lg focus:border-primary/50"
              />
              <FieldError errors={[form.formState.errors.url]} />
            </Field>

            <div className="space-y-3">
              <Label>Total Cost</Label>
              <div className="rounded-2xl border border-muted/10 bg-muted/5 p-6 shadow-inner">
                <div className="flex items-center justify-between border-muted/10 border-b pb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-muted-foreground text-xl">$</span>
                    <span className="font-bold text-4xl text-white">
                      {cost}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-muted/10 px-3 py-1.5 text-muted-foreground">
                    <span className="font-medium text-sm">USD</span>
                    <div className="flex flex-col text-[10px]">
                      <ArrowUp2
                        size={12}
                        variant="Bold"
                        className="cursor-pointer hover:text-white"
                      />
                      <ArrowDown2
                        size={12}
                        variant="Bold"
                        className="cursor-pointer hover:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">Pages</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xl">
                        {pages} pages
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <ArrowUp2
                      size={18}
                      variant="Bold"
                      className="cursor-pointer text-muted-foreground hover:text-white"
                      onClick={() => setPages((p) => p + 1)}
                    />
                    <ArrowDown2
                      size={18}
                      variant="Bold"
                      className="cursor-pointer text-muted-foreground hover:text-white"
                      onClick={() => setPages((p) => Math.max(1, p - 1))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="h-16 rounded-2xl bg-[#7C66FF] font-bold text-lg text-white hover:bg-[#6B55FF]"
            >
              Audit Now
            </Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
};
