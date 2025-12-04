"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Google } from "iconsax-reactjs";
import { type ComponentProps, useState } from "react";
import { useForm } from "react-hook-form";
import { SolanaIcon } from "@/components/icons";
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
import { signupEmailSchema } from "../auth.schema";
import type { SignupEmail } from "../auth.type";

export const SignupFormDialog = ({
  children,
  ...props
}: Partial<ComponentProps<typeof Dialog>>) => {
  const [signupType, setSignupType] = useState<"email" | "wallet">("email");
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col">
        <DialogHeader className="mb-8 flex flex-row items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            data-active={signupType === "email"}
            onClick={() => setSignupType("email")}
          >
            Sign-up with email
          </Button>
          <Button
            variant="ghost"
            size="sm"
            data-active={signupType === "wallet"}
            onClick={() => setSignupType("wallet")}
          >
            Connect wallet
          </Button>
        </DialogHeader>

        {signupType === "email" && <SignupEmailForm />}
        {signupType === "wallet" && <SignupWalletForm />}
      </DialogContent>
    </Dialog>
  );
};

export const SignupEmailForm = () => {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<SignupEmail>({
    resolver: zodResolver(signupEmailSchema),
  });

  const onSubmit = (data: SignupEmail) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col justify-center gap-4 text-center">
      <DialogHeader className="gap-2">
        <DialogTitle className="text-h2 text-white">
          Sign up with email
        </DialogTitle>
        <DialogDescription className="text-sm">
          New to web3? we have got you. Sign in manually with your email account
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Field data-invalid={!!errors.email}>
          <FieldLabel>Email address</FieldLabel>
          <Input placeholder="address@gmail.com" {...register("email")} />
          <FieldError errors={[errors.email]} />
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel>Password</FieldLabel>
          <Input placeholder="Password" {...register("password")} />
          <FieldError errors={[errors.password]} />
        </Field>
        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel>Confirm password</FieldLabel>
          <Input
            placeholder="Retype password"
            {...register("confirmPassword")}
          />
          <FieldError errors={[errors.confirmPassword]} />
        </Field>

        <div className="my-4 flex items-center gap-2 text-sm [&_hr]:grow">
          <hr />
          <span>Or</span>
          <hr />
        </div>

        <Button size="lg" type="button" variant="outline" className="group">
          <Google className="fill-current" />
          Continue with Google
          <ArrowRight className="ml-auto text-primary transition group-hover:translate-x-1" />
        </Button>
        <Button size="lg">Sign up now</Button>
      </form>
    </div>
  );
};

export const SignupWalletForm = () => {
  const { handleSubmit } = useForm<SignupEmail>({
    resolver: zodResolver(signupEmailSchema),
  });

  const onSubmit = (data: SignupEmail) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-4 text-center">
      <DialogHeader className="gap-2">
        <DialogTitle className="text-h2 text-white">
          Connect your wallet
        </DialogTitle>
        <DialogDescription className="text-sm">
          A web3 savvy? connect solana wallet here{" "}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Button size="lg" type="button" variant="outline" className="group">
          <SolanaIcon className="fill-current" />
          Solana
          <ArrowRight className="ml-auto text-primary transition group-hover:translate-x-1" />
        </Button>
        <Button size="lg">Connect wallet</Button>
      </form>
    </div>
  );
};
