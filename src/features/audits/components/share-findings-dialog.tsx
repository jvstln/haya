"use client";

import { Edit, Verify } from "iconsax-reactjs";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { gsap, useGSAP } from "@/lib/gsap.util";
import { cn } from "@/lib/utils";
import { useExportPdf } from "../audit.hook";
import type { Audit } from "../audit.type";
import { ShareFindingsBanner } from "./share-findings-banner";

type ShareFindingsDialogProps = React.ComponentProps<typeof Dialog> & {
  audit?: Audit;
  children?: React.ReactElement;
};

export const ShareFindingsDialog = ({
  audit,
  ...props
}: ShareFindingsDialogProps) => {
  const [email, setEmail] = useState("");

  const exportPdf = useExportPdf();

  const handleSend = () => {
    if (!audit?._id) return;
    exportPdf.mutate(audit._id);
  };

  return (
    <Dialog
      {...props}
      onOpenChange={(...args) => {
        props.onOpenChange?.(...args);
        const open = args[0];
        if (!open) {
          exportPdf.reset();
        }
      }}
    >
      {props.children && (
        <DialogTrigger disabled={!audit} render={props.children} />
      )}
      <DialogContent className="flex flex-col overflow-hidden">
        <DialogHeader className="">
          <DialogTitle>Share Findings</DialogTitle>
          <DialogDescription>
            Get a customized audit template to share with your team
          </DialogDescription>
        </DialogHeader>

        <div className="flex grow pt-8">
          {/* Left Column: Content */}
          <div className="flex flex-1 flex-col">
            {exportPdf.isPending ? (
              <LoadingState />
            ) : exportPdf.isSuccess ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                <Verify className="size-32 text-primary" />
                <p className="text-foreground text-lg">
                  Report generated successfully.
                  {email && (
                    <a href={`mailto:${email}`} className="link">
                      Check your email
                    </a>
                  )}
                </p>
              </div>
            ) : (
              <div className="flex h-full flex-col justify-center">
                <form
                  className="flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSend();
                  }}
                >
                  <Label>Email (optional)</Label>
                  <InputGroup>
                    <InputGroupInput
                      placeholder="enter email to receive the generated findings"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputGroupAddon align="inline-end">
                      <Edit className="text-primary" />
                    </InputGroupAddon>
                  </InputGroup>

                  <Button
                    type="submit"
                    isLoading={exportPdf.isPending}
                    loadingText="Generating..."
                  >
                    Generate report
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Right Column: Preview Card */}
          <div className="flex flex-1 items-center justify-center bg-transparent p-8">
            <ShareFindingsBanner />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const LoadingState = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const stepsList = [
    "Gathering design insights...",
    "Matching all findings",
    "Compiling findings",
    "We are almost there",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < stepsList.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        ".step-item",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.4 },
      );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-6">
      <div className="space-y-2">
        <h3 className="text-h3">Compiling Audit Reports</h3>
        <p className="text-muted-foreground text-sm">
          We are compiling all design and report findings and will notify you
          once it is sent to your email. You can continue other activities while
          we work in the background.
        </p>
      </div>

      <ul className="space-y-4">
        {stepsList.map((label, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <li
              key={label}
              className={cn(
                "step-item flex items-center gap-3 transition-opacity duration-300",
                index > currentStep ? "opacity-30" : "opacity-100",
              )}
            >
              <div className="relative flex size-5 shrink-0 items-center justify-center">
                {isCompleted ? (
                  <Verify className="text-primary" size={20} />
                ) : isActive ? (
                  <Spinner className="text-primary" />
                ) : (
                  <span className="size-2 rounded-full bg-muted-foreground/30" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm transition-colors duration-300",
                  isCompleted
                    ? "text-primary"
                    : isActive
                      ? "font-medium text-white"
                      : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
