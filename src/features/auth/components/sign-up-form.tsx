import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Google } from "iconsax-reactjs";
import { type UseFormReturn, useForm } from "react-hook-form";
import { SolanaIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

import { signUpEmailSchema } from "../auth.schema";
import type { SignUpEmail, SignUpEmailInput } from "../auth.type";
import { PasswordRequirements } from "./password-requirements";

export const SignupEmailForm = ({
  form,
  onSubmit,
  isLoading,
}: {
  form: UseFormReturn<SignUpEmailInput, unknown, SignUpEmail>;
  onSubmit: (values: SignUpEmail) => void;
  isLoading: boolean;
}) => {
  const {
    formState: { errors },
    register,
    handleSubmit,
    control,
  } = form;

  return (
    <div className="flex flex-col justify-center gap-4">
      <DialogHeader className="gap-2">
        <DialogTitle className="text-h2 text-white">
          Sign up with email
        </DialogTitle>
        <DialogDescription className="text-sm">
          New to web3? we have got you. Sign in manually with your email account
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Field data-invalid={!!errors.name}>
          <FieldLabel>Full name</FieldLabel>
          <Input placeholder="John Doe" {...register("name")} />
          <FieldError errors={[errors.name]} />
        </Field>
        <Field data-invalid={!!errors.email}>
          <FieldLabel>Email address</FieldLabel>
          <Input placeholder="address@gmail.com" {...register("email")} />
          <FieldError errors={[errors.email]} />
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel>Password</FieldLabel>
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          <PasswordRequirements
            control={control}
            name="password"
            isInvalid={!!errors.password}
          />
        </Field>
        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel>Confirm password</FieldLabel>
          <Input
            type="password"
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

        <Button
          size="lg"
          type="button"
          variant="outline"
          className="group"
          disabled={isLoading}
        >
          <Google className="fill-current" />
          Continue with Google
          <ArrowRight className="ml-auto text-primary transition group-hover:translate-x-1" />
        </Button>
        <Button size="lg" isLoading={isLoading}>
          Sign up now
        </Button>
      </form>
    </div>
  );
};

export const SignupWalletForm = () => {
  const { handleSubmit } = useForm<SignUpEmailInput, unknown, SignUpEmail>({
    resolver: zodResolver(signUpEmailSchema),
  });

  const onSubmit = (data: SignUpEmail) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-4">
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
        <Button
          size="lg"
          onClick={async () => {
            await api.post("https://api.usehaya.io/api/v1/auth/nonce", {
              walletAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
            });
          }}
        >
          Connect wallet
        </Button>
      </form>
    </div>
  );
};
