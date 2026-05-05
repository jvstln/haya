"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, StepperButton } from "@/components/ui/button";
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
import { HayaSpinner, Spinner } from "@/components/ui/spinner";
import { useAudit, useCreateAudit, usePreAuditInfo } from "../audit.hook";
import { newAuditSchema } from "../audit.schema";
import { getIsAuditInProgress } from "../audit.service";
import type { NewAudit } from "../audit.type";

const FloatingTag = ({
  color,
  label,
  delay,
  duration,
  top,
  left,
  right,
}: {
  color: "high" | "med" | "low";
  label: string;
  delay: string;
  duration: string;
  top: string;
  left?: string;
  right?: string;
}) => {
  const colorMap = {
    high: {
      badge: "bg-[#E54D3E]/12 text-[#E54D3E] border-[#E54D3E]/28",
      text: "HIGH",
    },
    med: {
      badge: "bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/22",
      text: "MED",
    },
    low: {
      badge: "bg-[#22C55E]/08 text-[#22C55E] border-[#22C55E]/18",
      text: "LOW",
    },
  }[color];

  return (
    <div
      className="pointer-events-none absolute flex animate-[tagFloat_linear_infinite] items-center gap-1 whitespace-nowrap text-[8.5px] tracking-wide"
      style={{
        top,
        left,
        right,
        animationDelay: delay,
        animationDuration: duration,
      }}
    >
      <span
        className={`rounded-[2px] border px-1 py-0.5 font-medium text-[7px] tracking-widest ${colorMap.badge}`}
      >
        {colorMap.text}
      </span>
      <span className="text-white/55">{label}</span>
    </div>
  );
};

export const AuditAnimation = () => {
  return (
    <div className="relative flex h-[420px] w-full items-center justify-center overflow-hidden font-mono">
      <style>{`
        @keyframes drift {
          from { background-position: 0 0; }
          to { background-position: 28px 28px; }
        }
        @keyframes sweep {
          0% { top: -3px; opacity: 0; }
          8% { opacity: 0.55; }
          92% { opacity: 0.3; }
          100% { top: calc(100% + 3px); opacity: 0; }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.45; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.025); }
        }
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes irisR {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes pupilB {
          0%, 100% { width: 28px; height: 28px; }
          50% { width: 20px; height: 20px; }
        }
        @keyframes blink {
          0%, 84%, 100% { transform: scaleY(0); }
          89%, 95% { transform: scaleY(1); }
        }
        @keyframes tagFloat {
          0% { opacity: 0; transform: translateY(0); }
          12% { opacity: 1; }
          82% { opacity: 0.7; }
          100% { opacity: 0; transform: translateY(-60px); }
        }
      `}</style>

      {/* Dot Grid */}
      <div className="absolute inset-0 animate-[drift_22s_linear_infinite] bg-[length:28px_28px] bg-[radial-gradient(circle,rgba(122,99,255,0.07)_1px,transparent_1px)]" />

      {/* Beam */}
      <div className="absolute top-[-3px] right-0 left-0 h-[2px] animate-[sweep_4s_cubic-bezier(0.4,0,0.6,1)_infinite] bg-linear-to-r from-transparent via-primary to-transparent opacity-[0.55]" />

      {/* Corners */}
      <div className="absolute top-[14px] left-[14px] h-[16px] w-[16px] border-[#7A63FF]/30 border-t-[1.5px] border-l-[1.5px]" />
      <div className="absolute top-[14px] right-[14px] h-[16px] w-[16px] border-[#7A63FF]/30 border-t-[1.5px] border-r-[1.5px]" />
      <div className="absolute bottom-[14px] left-[14px] h-[16px] w-[16px] border-[#7A63FF]/30 border-b-[1.5px] border-l-[1.5px]" />
      <div className="absolute right-[14px] bottom-[14px] h-[16px] w-[16px] border-[#7A63FF]/30 border-r-[1.5px] border-b-[1.5px]" />

      {/* Scene */}
      <div className="relative h-[280px] w-[280px] shrink-0">
        {/* Rings */}
        <div className="absolute top-1/2 left-1/2 h-[268px] w-[268px] animate-[breathe_4s_ease-in-out_infinite] rounded-full border-[#7A63FF]/10 border-[0.5px]" />
        <div className="absolute top-1/2 left-1/2 h-[214px] w-[214px] animate-[breathe_4s_ease-in-out_infinite_0.55s] rounded-full border-[#7A63FF]/16 border-[0.5px]" />
        <div className="absolute top-1/2 left-1/2 h-[162px] w-[162px] animate-[breathe_4s_ease-in-out_infinite_1.1s] rounded-full border-[#7A63FF]/24 border-[0.5px]" />

        {/* Orbiting Orbs */}
        <div className="absolute top-1/2 left-1/2 h-[252px] w-[252px] animate-[spin_9s_linear_infinite] rounded-full">
          <div className="absolute top-[-3.5px] left-1/2 ml-[-3.5px] h-[7px] w-[7px] rounded-full bg-[#E54D3E] shadow-[0_0_8px_rgba(229,77,62,0.38)]" />
          <div className="absolute top-1/2 left-full mt-[-3.5px] ml-[-3.5px] h-[7px] w-[7px] rounded-full bg-[#22C55E] shadow-[0_0_7px_rgba(34,197,94,0.32)]" />
        </div>
        <div className="absolute top-1/2 left-1/2 h-[200px] w-[200px] animate-[spin_6.5s_linear_infinite_reverse] rounded-full">
          <div className="absolute top-[-3.5px] left-1/2 ml-[-3.5px] h-[7px] w-[7px] rounded-full bg-[#F5A623] shadow-[0_0_8px_rgba(245,166,35,0.32)]" />
          <div className="absolute top-full left-1/2 mt-[-3.5px] ml-[-3.5px] h-[7px] w-[7px] rounded-full bg-[#9B87FF] shadow-[0_0_9px_rgba(122,99,255,0.38)]" />
        </div>
        <div className="absolute top-1/2 left-1/2 h-[150px] w-[150px] animate-[spin_4.2s_linear_infinite] rounded-full">
          <div className="absolute top-[-3.5px] left-1/2 ml-[-3.5px] h-[7px] w-[7px] rounded-full bg-[#E54D3E] shadow-[0_0_8px_rgba(229,77,62,0.38)]" />
        </div>

        {/* Eye Shell */}
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[112px] w-[112px] overflow-hidden rounded-full border-[#7A63FF]/40 border-[1.5px] bg-[#0C0A1A]">
          <div className="absolute top-1/2 left-1/2 h-[80px] w-[80px] animate-[irisR_5s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#2A1D88,#7A63FF,#9B87FF,#7A63FF,#4A35CC,#7A63FF,#9B87FF,#2A1D88)]" />
          <div className="absolute top-1/2 left-1/2 h-[56px] w-[56px] animate-[irisR_5s_linear_infinite_reverse] rounded-full bg-[conic-gradient(from_60deg,#1A1040,#4A35CC,#1A1040,#4A35CC)]" />
          <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-[2] h-[28px] w-[28px] animate-[pupilB_2.8s_ease-in-out_infinite] rounded-full bg-[#06050F]">
            <div className="absolute top-[6px] right-[6px] h-[5px] w-[5px] rounded-full bg-[#9B87FF]/95" />
          </div>
          {/* Lids */}
          <div className="absolute top-0 right-0 left-0 z-[3] h-[56px] origin-bottom scale-y-0 animate-[blink_6s_ease-in-out_infinite] rounded-t-full bg-[#07060F]" />
          <div className="absolute right-0 bottom-0 left-0 z-[3] h-[56px] origin-top scale-y-0 animate-[blink_6s_ease-in-out_infinite] rounded-b-full bg-[#07060F]" />
        </div>

        {/* Floating Tags */}
        <FloatingTag
          color="high"
          label="CTA below fold"
          delay="0s"
          duration="4.2s"
          top="180px"
          left="20px"
        />
        <FloatingTag
          color="med"
          label="no autofill on ZIP"
          delay="1.3s"
          duration="5s"
          top="194px"
          right="24px"
        />
        <FloatingTag
          color="high"
          label="card field rejects spaces"
          delay="2.6s"
          duration="4.6s"
          top="212px"
          left="36px"
        />
        <FloatingTag
          color="low"
          label="trust badge contrast"
          delay="0.7s"
          duration="3.9s"
          top="166px"
          right="18px"
        />
        <FloatingTag
          color="med"
          label="28% drop · step 3"
          delay="3.2s"
          duration="5.3s"
          top="228px"
          left="60px"
        />
        <FloatingTag
          color="high"
          label="67% viewport miss"
          delay="1.9s"
          duration="4.8s"
          top="220px"
          right="48px"
        />
      </div>
    </div>
  );
};

export const NewAuditForm = ({
  children,
  open: controlledOpen,
  ...props
}: React.ComponentProps<typeof Dialog>) => {
  const [_open, _setOpen] = useState(false);
  const createAudit = useCreateAudit();
  const router = useRouter();

  // Used to store the returned analysed audit id.. then fetch the current audit and only proceed when the audit status is completed
  const [newAuditId, setNewAuditId] = useState("");
  const newAudit = useAudit(newAuditId);

  console.log(newAuditId);

  useEffect(() => {
    if (!newAudit.data) return;
    if (!getIsAuditInProgress(newAudit.data)) {
      router.push(`/dashboard/audits/${newAuditId}`);
      setNewAuditId("");
    }
  }, [newAuditId, newAudit.data, router.push]);

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
        setNewAuditId(data?._id);
      },
    });
  };

  const isLoading =
    form.formState.isSubmitting ||
    createAudit.isPending ||
    (newAuditId && getIsAuditInProgress(newAudit.data));

  console.log(preAuditInfo.data);

  return (
    <Dialog {...props} open={isLoading ? true : open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {isLoading ? (
        // <DialogContent
        //   className="flex min-h-80 flex-col items-center justify-center **:data-[slot=loader]:my-auto"
        //   style={{
        //     background:
        //       "radial-gradient(circle at 50% 0%, oklch(from var(--color-primary) l c h / 0.2), transparent), var(--color-background)",
        //   }}
        // >
        //   <HayaSpinner />
        //   <span className="text-sm">Running your audit</span>
        <DialogContent className="overflow-hidden border-none p-0">
          <AuditAnimation />
          <div className="absolute right-0 bottom-10 left-0 text-center">
            <span className="font-medium text-sm text-white/70">
              Running your audit
            </span>
          </div>
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
                {preAuditInfo.isFetching ? <Spinner /> : null}
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
