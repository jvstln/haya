import { ArrowRight, Google } from "iconsax-reactjs";
import { X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { SolanaIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { SignUpEmail, SignUpEmailInput } from "../auth.type";
import { useSolanaAuth } from "../solana.hook";
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
      <form
        onSubmit={handleSubmit(onSubmit, (error) => {
          console.log("Signup validation error", error, form.getValues());
        })}
        className="flex flex-col gap-2"
      >
        <Field data-invalid={!!errors.email}>
          <FieldLabel>Email address</FieldLabel>
          <Input
            type="email"
            placeholder="address@gmail.com"
            {...register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel>Password</FieldLabel>
          <Input
            type="password"
            placeholder="Password"
            {...register("password", {
              onChange: (e) => {
                form.setValue("confirmPassword", e.target.value);
              },
            })}
          />
          <PasswordRequirements
            control={control}
            name="password"
            isInvalid={!!errors.password}
          />
        </Field>
        {/* <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel>Confirm password</FieldLabel>
          <Input
            type="password"
            placeholder="Retype password"
            {...register("confirmPassword")}
          />
          <FieldError errors={[errors.confirmPassword]} />
        </Field> */}

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

export const SignUpWalletForm = () => {
  const {
    setModalVisibility,
    connected,
    walletAddress,
    authenticate,
    isAuthenticating,
    disconnect,
  } = useSolanaAuth();

  const truncatedAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : null;

  return (
    <div className="flex flex-col gap-4">
      <DialogHeader className="gap-2">
        <DialogTitle className="text-h2 text-white">
          Connect your wallet
        </DialogTitle>
        <DialogDescription className="text-sm">
          A web3 savvy? connect solana wallet here
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        {connected && walletAddress ? (
          <>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <SolanaIcon className="h-5 w-5 fill-current" />
                <span className="text-sm text-white/80">
                  {truncatedAddress}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary text-xs">Connected</span>
                <button
                  type="button"
                  onClick={() => disconnect()}
                  className="text-muted-foreground transition-colors hover:text-white"
                  aria-label="Disconnect wallet"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <Button
              size="lg"
              onClick={authenticate}
              isLoading={isAuthenticating}
            >
              Sign in with wallet
            </Button>
          </>
        ) : (
          <Button
            size="lg"
            type="button"
            variant="outline"
            className="group"
            onClick={() => setModalVisibility(true)}
          >
            <SolanaIcon className="fill-current" />
            Connect Solana Wallet
            <ArrowRight className="ml-auto text-primary transition group-hover:translate-x-1" />
          </Button>
        )}
      </div>
    </div>
  );
};
