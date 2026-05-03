"use client";

import { Edit, Verify } from "iconsax-reactjs";
import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { LogoDark } from "@/public/logo";
import type { ParsedAudit } from "../audit.type";

type Step = "input" | "compiling" | "success";

type ShareFindingsDialogProps = React.ComponentProps<typeof Dialog> & {
  audit: ParsedAudit;
};

export const ShareFindingsDialog = ({
  audit,
  ...props
}: ShareFindingsDialogProps) => {
  const [step, setStep] = useState<Step>("success");
  const [email, setEmail] = useState("");

  const handleSend = () => {
    setStep("compiling");
    // Simulate compilation
    setTimeout(() => {
      setStep("success");
    }, 3000);
  };

  return (
    <Dialog {...props}>
      {props.children && (
        <DialogTrigger asChild>{props.children}</DialogTrigger>
      )}
      <DialogContent className="flex h-full max-h-[90vh] flex-col overflow-hidden sm:max-w-auto">
        <DialogHeader className="">
          <DialogTitle>Share Findings</DialogTitle>
          <DialogDescription>
            Get a customized audit template to share with your team
          </DialogDescription>
        </DialogHeader>

        <div className="flex grow pt-8">
          {/* Left Column: Content */}
          <div className="flex flex-1 flex-col">
            {step === "input" && (
              <div className="flex h-full flex-col justify-center">
                <form
                  className="flex flex-col gap-3"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <Label>Email</Label>
                  <InputGroup>
                    <InputGroupInput
                      placeholder="enter email to receive the findings"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      // className="text-white placeholder:text-muted-foreground/50"
                    />
                    <InputGroupAddon align="inline-end">
                      <Edit className="text-primary" />
                    </InputGroupAddon>
                  </InputGroup>

                  <Button onClick={handleSend} disabled={!email}>
                    Send Report
                  </Button>
                </form>
              </div>
            )}

            {step === "compiling" && (
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <h3 className="text-h3">Compiling Audit Reports</h3>
                  <p className="text-muted-foreground text-sm">
                    We are compiling all design and report findings and will
                    notify you once it is sent to your email. You can continue
                    other activities while we work in the background.
                  </p>
                </div>

                <ul className="space-y-4">
                  <ChecklistItem label="Gathering design insights..." checked />
                  <ChecklistItem label="Matching all findings" checked />
                  <ChecklistItem label="Compiling findings" checked />
                  <ChecklistItem label="We are almost there" checked />
                </ul>
              </div>
            )}

            {step === "success" && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                <Verify className="size-32 text-primary" />
                <p className="text-lg text-white">
                  Successfully sent.{" "}
                  <a href={`mailto:${email}`} className="link">
                    Check your email
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Preview Card */}
          <div className="flex flex-1 items-center justify-center bg-transparent p-8">
            <PreviewCard url={audit.url} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ChecklistItem = ({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) => (
  <li className="flex items-center gap-3">
    <Verify
      size={20}
      className={cn(checked ? "text-primary" : "text-muted-foreground")}
    />
    <span className="text-muted-foreground text-sm">{label}</span>
  </li>
);

const PreviewCard = ({ url }: { url: string }) => {
  return (
    <div className="relative flex aspect-square w-full flex-col justify-center overflow-hidden rounded-[40px] bg-[#7C66FF] p-10 text-black shadow-2xl">
      {/* Petal decorations */}
      <div className="-translate-y-1/2 absolute top-5 right-5 size-56 translate-x-1/2 opacity-90">
        <LogoDark />
      </div>
      <div className="-translate-x-1/2 absolute bottom-5 left-5 size-56 translate-y-1/2 opacity-90">
        <LogoDark />
      </div>

      <div className="relative z-10 space-y-4">
        <h2 className="font-bold font-syncopate text-[64px] leading-none tracking-[16px]">
          UX <br /> AUDIT
        </h2>
        <p className="font-medium text-sm opacity-80">{url}</p>
      </div>
    </div>
  );
};
