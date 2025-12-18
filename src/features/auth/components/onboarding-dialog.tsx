import { zodResolver } from "@hookform/resolvers/zod";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ArrowLeft2 } from "iconsax-reactjs";
import { type ComponentProps, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  useForgotPassword,
  useLogin,
  useResendVerification,
  useResetPassword,
  useSignUpEmail,
  useVerifyOtp,
} from "../auth.hook";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signUpEmailSchema,
  verifyOtpSchema,
} from "../auth.schema";
import type {
  ForgotPassword,
  LoginEmail,
  ResetPassword,
  SignUpEmail,
  SignUpEmailInput,
  VerifyOtp,
} from "../auth.type";
import { ForgotPasswordForm, ResetPasswordForm } from "./forgot-password-form";
import { LoginForm } from "./login-form";
import { VerifyOtpForm } from "./otp-form";
import { SignUpWalletForm, SignupEmailForm } from "./sign-up-form";

export type Views =
  | "signUpEmail"
  | "signUpWallet"
  | "verifyOtp"
  | "login"
  | "forgotPassword"
  | "resetPassword";

// A mini store to manage the current view of the onboarding form dialog. null means the dialog is closed
const useOnboardingFormDialogView = create<Views | null>()(() => null);

// A function that controls when the dialog is open
export const setOnboardingFormDialogView = (view: Views | null) => {
  useOnboardingFormDialogView.setState(view);
};

export const OnboardingFormDialog = ({
  children,
  ...props
}: Partial<ComponentProps<typeof Dialog>>) => {
  const view = useOnboardingFormDialogView();
  const setView = setOnboardingFormDialogView;

  // --- Code to ensure dialog remains visible when wallet modal is opened and closed ---
  const { visible } = useWalletModal();
  const [previousView, setPreviousView] = useState<Views | null>(null);

  useEffect(() => {
    if (visible && view) {
      setPreviousView(view);
      setView(null);
    } else if (!visible && previousView) {
      setView(previousView);
      setPreviousView(null);
    }
  }, [visible, view, previousView, setView]);
  // -----------------------

  const signUpEmailForm = useForm<SignUpEmailInput, unknown, SignUpEmail>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signUpEmailSchema),
  });

  const verifyEmailForm = useForm<VerifyOtp>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const loginForm = useForm<LoginEmail>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const forgotPasswordForm = useForm<ForgotPassword>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const resetPasswordForm = useForm<ResetPassword>({
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const signUpEmail = useSignUpEmail();
  const verifyOtp = useVerifyOtp();
  const resendVerification = useResendVerification();
  const login = useLogin();
  const forgotPassword = useForgotPassword();
  const resetPassword = useResetPassword();

  const isMutating =
    signUpEmail.isPending ||
    verifyOtp.isPending ||
    resendVerification.isPending ||
    login.isPending ||
    forgotPassword.isPending ||
    resetPassword.isPending;

  const handleLogin = (values: LoginEmail) => {
    login.mutate(values, {
      onSuccess: () => setView(null),
      onError(error, { email }) {
        if (!error.message.includes("verify")) return;

        // If error contains "verify", show resend email verification button
        toast.error(`Error: ${error.message}`, {
          description: (
            <Button
              size="sm"
              variant="glass-primary"
              onClick={() => {
                resendVerification.mutate(
                  { email },
                  { onSuccess: () => setView("verifyOtp") }
                );
                toast.dismiss("login");
              }}
            >
              Click here to resend email
            </Button>
          ),
          className: "pointer-events-auto",
          duration: 7 * 1000,
          id: "login",
        });
      },
    });
  };

  if (!view) return null;

  return (
    <Dialog
      {...props}
      open={isMutating || view === "verifyOtp" ? true : !!view}
      onOpenChange={(open) => {
        if (!open) setView(null);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col">
        {view.startsWith("signUp") && (
          <div className="mb-4 flex flex-row items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              data-active={view === "signUpEmail"}
              onClick={() => setView("signUpEmail")}
            >
              Sign-up with email
            </Button>
            <Button
              variant="ghost"
              size="sm"
              data-active={view === "signUpWallet"}
              onClick={() => setView("signUpWallet")}
            >
              Connect wallet
            </Button>
          </div>
        )}

        {view === "verifyOtp" && (
          <div className="mb-4 flex flex-row items-center gap-1">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setView("signUpEmail")}
            >
              <ArrowLeft2 />
            </Button>
          </div>
        )}

        {view === "signUpEmail" && (
          <div className="flex flex-col gap-1">
            <SignupEmailForm
              form={signUpEmailForm}
              onSubmit={(values) =>
                signUpEmail.mutate(values, {
                  onSuccess: () => setView("verifyOtp"),
                })
              }
              isLoading={signUpEmail.isPending}
            />
            <Button variant="link" onClick={() => setView("login")}>
              Already have an account? Login
            </Button>
          </div>
        )}

        {view === "signUpWallet" && <SignUpWalletForm />}

        {view === "verifyOtp" && (
          <VerifyOtpForm
            form={verifyEmailForm}
            onSubmit={(values) => {
              verifyOtp.mutate(values, {
                onSuccess: () => setView("login"),
              });
            }}
            onResend={() => {
              resendVerification.mutate({
                email: signUpEmailForm.getValues("email"),
              });
            }}
            isVerifing={verifyOtp.isPending}
            isResending={resendVerification.isPending}
          />
        )}

        {view === "login" && (
          <div className="flex flex-col gap-1">
            <LoginForm
              form={loginForm}
              onSubmit={handleLogin}
              isLoading={login.isPending || resendVerification.isPending}
            />

            <div className="flex justify-between">
              <Button variant="link" onClick={() => setView("signUpEmail")}>
                Don't have an account? Sign up
              </Button>
              <Button variant="link" onClick={() => setView("forgotPassword")}>
                Forgot password?
              </Button>
            </div>
          </div>
        )}

        {view === "forgotPassword" && (
          <div className="flex flex-col gap-1">
            <ForgotPasswordForm
              form={forgotPasswordForm}
              onSubmit={(values) =>
                forgotPassword.mutate(values, {
                  onSuccess: () => setView("resetPassword"),
                })
              }
              isLoading={forgotPassword.isPending}
            />

            <Button variant="link" onClick={() => setView("login")}>
              Back to login
            </Button>
          </div>
        )}

        {view === "resetPassword" && (
          <div className="flex flex-col gap-1">
            <ResetPasswordForm
              form={resetPasswordForm}
              onSubmit={(values) =>
                resetPassword.mutate(values, {
                  onSuccess: () => setView("login"),
                })
              }
              isLoading={resetPassword.isPending}
            />

            <Button variant="link" onClick={() => setView("forgotPassword")}>
              Resend code
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
