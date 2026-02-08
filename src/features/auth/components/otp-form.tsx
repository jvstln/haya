import { Controller, type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type { VerifyOtp } from "../auth.type";

export const VerifyOtpForm = ({
  form,
  onSubmit,
  onResend,
  isVerifing,
  isResending,
}: {
  form: UseFormReturn<VerifyOtp>;
  onSubmit: (values: VerifyOtp) => void;
  onResend: () => void;
  isVerifing: boolean;
  isResending: boolean;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-4">
      <DialogHeader className="gap-2">
        <DialogTitle className="text-center text-h2 text-white">
          Verify OTP
        </DialogTitle>
        <DialogDescription className="text-center text-sm">
          Enter the code sent to your email
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
        {errors.code && (
          <p className="text-center text-destructive text-sm">
            {errors.code.message}
          </p>
        )}
        <div className="flex items-center gap-4 *:flex-1">
          <Button
            size="lg"
            color="secondary"
            type="button"
            disabled={isVerifing}
            isLoading={isResending}
            onClick={onResend}
          >
            Resend
          </Button>
          <Button
            size="lg"
            type="submit"
            disabled={isResending}
            isLoading={isVerifing}
          >
            Verify
          </Button>
        </div>
      </form>
    </div>
  );
};
