"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Information } from "iconsax-reactjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  createDialogHandle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input, inputSizeClassName } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useCreateAudit } from "../audit.hook";
import { auditTypes, newAuditSchema } from "../audit.schema";
import type { NewAudit } from "../audit.type";

export const NewAuditForm = ({
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & { children: React.ReactElement }) => {
  const [dialogHandle] = useState(createDialogHandle);
  const createAudit = useCreateAudit();
  const router = useRouter();

  const form = useForm<NewAudit>({
    defaultValues: { url: "", audit_type: "landing_page" },
    resolver: zodResolver(newAuditSchema),
  });

  const handleSubmit = (values: NewAudit) => {
    createAudit.mutate(values, {
      onSuccess(data) {
        router.push(`/dashboard/track-experience/${data._id}`);
      },
    });
  };

  const isLoading = form.formState.isSubmitting || createAudit.isPending;

  return (
    <Dialog
      handle={dialogHandle}
      {...props}
      onOpenChange={(...args) => {
        if (isLoading) return args[1].cancel();
        props.onOpenChange?.(...args);
      }}
    >
      {children && <DialogTrigger render={children} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-h1">
            Track Users Friction Before It Costs You
          </DialogTitle>
          <DialogDescription>
            Paste your product URL. Haya reads your users' behavioral patterns
            and tells you exactly where they're breaking.
          </DialogDescription>
        </DialogHeader>

        <form
          className="mt-6 flex flex-col gap-6"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Field data-invalid={!!form.formState.errors.url}>
            <FieldLabel>Product URL</FieldLabel>
            <Input
              {...form.register("url")}
              aria-invalid={!!form.formState.errors.url}
              placeholder="Enter link"
              disabled={isLoading}
            />
            <FieldError errors={[form.formState.errors.url]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.url}>
            <FieldLabel>
              Product Type
              <Popover>
                <PopoverTrigger openOnHover>
                  <Information className="size-4" />
                </PopoverTrigger>
                <PopoverContent>
                  <div>
                    <strong>Landing Pages</strong> are public-facing pages
                    (e.g., Homepage, About, Contact). <br />
                    <br />
                    <strong> Product Pages</strong> are authenticated areas
                    accessible only after logging in.
                  </div>
                </PopoverContent>
              </Popover>
            </FieldLabel>

            <Controller
              name="audit_type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldGroup>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex items-center gap-4"
                    >
                      {auditTypes.map(({ label, value }) => (
                        <FieldLabel
                          key={value}
                          className={cn(
                            inputSizeClassName,
                            "rounded-full border-primary p-4 has-data-checked:border has-data-unchecked:bg-muted has-data-checked:text-foreground",
                          )}
                        >
                          <RadioGroupItem value={value} />
                          {label}
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                  </FieldGroup>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </Field>

          <Button type="submit" size="lg" isLoading={isLoading}>
            Track experience
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
