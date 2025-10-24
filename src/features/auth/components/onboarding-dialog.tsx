"use client";
import { Mail } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  type ComponentProps,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { GiftIcon, SolanaIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Step = 1 | 2 | 3;
type SignupType = "email" | "wallet";
type StepProps = {
  step: Step;
  setStep: Dispatch<SetStateAction<Step>>;
  signupType: SignupType | null;
  setSignupType: Dispatch<SetStateAction<SignupType | null>>;
};

export const OnboardingDialog = (
  props: Partial<ComponentProps<typeof Dialog>>
) => {
  const [step, setStep] = useState<Step>(1);
  const [signupType, setSignupType] = useState<SignupType | null>(null);

  const stepProps = {
    step,
    setStep,
    signupType,
    setSignupType,
  };

  return (
    <Dialog {...props}>
      <DialogContent className="flex h-119.75 flex-col items-center justify-center sm:max-w-197.5">
        {step === 1 && <OnboardingDialogStep1 {...stepProps} />}
        {step === 2 && <OnboardingDialogStep2 {...stepProps} />}
        {step === 3 && <OnboardingDialogStep3 {...stepProps} />}
      </DialogContent>
    </Dialog>
  );
};

export const OnboardingDialogStep1 = ({ setStep }: StepProps) => {
  return (
    <div className="flex w-108.5 flex-col items-center justify-center gap-6 text-center">
      <GiftIcon />
      <DialogHeader>
        <DialogTitle className="text-center font-semibold text-xl">
          Grab your free gift
        </DialogTitle>
        <DialogDescription className="text-center">
          Join today and unlock access to{" "}
          <span className="text-white">1000+ real project websites</span>. Run
          your first audit, send a professional review in minutes, and{" "}
          <span className="text-white">start earning</span>
          from your first client.
        </DialogDescription>
      </DialogHeader>
      <Button
        variant="colorful"
        className="self-stretch"
        onClick={() => setStep(2)}
      >
        Sign up now
      </Button>
    </div>
  );
};

export const OnboardingDialogStep2 = ({
  setStep,
  setSignupType,
}: StepProps) => {
  const handleSignupTypeChange = (type: SignupType) => {
    setStep(3);
    setSignupType(type);
  };

  return (
    <div className="flex w-108.5 flex-col gap-6 text-center">
      <div className="flex items-center justify-between gap-4">
        <SolanaIcon />
        <span className="mr-auto font-bold">Solana</span>
        <Link href="#" onClick={() => handleSignupTypeChange("wallet")}>
          Connect wallet
        </Link>
      </div>
      <div className="flex items-center gap-4 [&_hr]:grow">
        <hr />
        <span className="">OR</span>
        <hr />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Mail />
        <span className="mr-auto font-bold">Email</span>
        <Link href="#" onClick={() => handleSignupTypeChange("email")}>
          Email signup
        </Link>
      </div>
    </div>
  );
};

export const OnboardingDialogStep3 = (props: StepProps) => {
  return (
    <div className="flex w-108.5 flex-col items-center justify-center gap-6 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        className="size-20"
      >
        <title>Work in progress</title>
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        >
          <path
            strokeDasharray="2 4"
            strokeDashoffset={6}
            d="M12 21c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9"
          >
            <animate
              attributeName="stroke-dashoffset"
              dur="0.6s"
              repeatCount="indefinite"
              values="6;0"
            />
          </path>
          <path
            strokeDasharray={32}
            strokeDashoffset={32}
            d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9"
          >
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.1s"
              dur="0.4s"
              values="32;0"
            />
          </path>
          <path strokeDasharray={10} strokeDashoffset={10} d="M12 16v-7.5">
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.5s"
              dur="0.2s"
              values="10;0"
            />
          </path>
          <path
            strokeDasharray={6}
            strokeDashoffset={6}
            d="M12 8.5l3.5 3.5M12 8.5l-3.5 3.5"
          >
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.7s"
              dur="0.2s"
              values="6;0"
            />
          </path>
        </g>
      </svg>
      <DialogHeader>
        <DialogTitle className="text-center text-xl">
          This is still a work in progress
        </DialogTitle>
      </DialogHeader>
      <Button
        variant="colorful"
        className="self-stretch"
        onClick={() => redirect("/dashboard/analyze")}
      >
        Close
      </Button>
    </div>
  );
};
