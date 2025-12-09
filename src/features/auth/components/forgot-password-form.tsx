import { Controller, type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import type { ForgotPassword, ResetPassword } from "../auth.type";
import { PasswordRequirements } from "./password-requirements";

export const ForgotPasswordForm = ({
  form,
  onSubmit,
  isLoading,
}: {
  form: UseFormReturn<ForgotPassword>;
  onSubmit: (values: ForgotPassword) => void;
  isLoading: boolean;
}) => {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = form;

  return (
    <div className="flex flex-col justify-center gap-4">
      <DialogHeader className="gap-2">
        <DialogTitle className="text-h2 text-white">
          Forgot Password
        </DialogTitle>
        <DialogDescription className="text-sm">
          Enter your email address and we'll send you a code to reset your
          password
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field data-invalid={!!errors.email}>
          <FieldLabel>Email address</FieldLabel>
          <Input placeholder="address@gmail.com" {...register("email")} />
          <FieldError errors={[errors.email]} />
        </Field>

        <Button size="lg" isLoading={isLoading}>
          Send Reset Code
        </Button>
      </form>
    </div>
  );
};

export const ResetPasswordForm = ({
  form,
  onSubmit,
  isLoading,
}: {
  form: UseFormReturn<ResetPassword>;
  onSubmit: (values: ResetPassword) => void;
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
        <DialogTitle className="text-h2 text-white">Reset Password</DialogTitle>
        <DialogDescription className="text-sm">
          Enter the code sent to your email and create a new password
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field data-invalid={!!errors.code}>
          <FieldLabel>Reset Code</FieldLabel>
          <div className="flex justify-center">
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
          </div>
          <FieldError errors={[errors.code]} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel>New Password</FieldLabel>
          <Input
            type="password"
            placeholder="Enter new password"
            {...register("password")}
          />
          <PasswordRequirements
            control={control}
            name="password"
            isInvalid={!!errors.password}
          />
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel>Confirm Password</FieldLabel>
          <Input
            type="password"
            placeholder="Confirm new password"
            {...register("confirmPassword")}
          />
          <FieldError errors={[errors.confirmPassword]} />
        </Field>

        <Button size="lg" isLoading={isLoading}>
          Reset Password
        </Button>
      </form>
    </div>
  );
};
