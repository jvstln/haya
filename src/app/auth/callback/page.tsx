"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HayaSpinner } from "@/components/ui/spinner";
import { useExchangeGoogleAuthCode } from "@/features/auth/auth.hook";
import { redirectToGoogleAuth } from "@/features/auth/auth.service";

const AuthCallbackHandler = () => {
  const searchParams = useSearchParams();
  const hasCalledRef = useRef(false);

  const {
    mutate: exchangeCode,
    isError,
    isSuccess,
  } = useExchangeGoogleAuthCode();

  const code = searchParams.get("code");

  useEffect(() => {
    if (hasCalledRef.current) return;
    hasCalledRef.current = true;

    if (code) {
      exchangeCode(code);
    } else {
      toast.error("Couldn't sign you in", {
        description: "Authentication code not found. Please try again later",
      });
    }
  }, [code, exchangeCode]);

  if (isSuccess) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <h2 className="text-xl text-success">Sign in succesful</h2>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    );
  }

  if (isError || !code) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Something went wrong</p>
        <Button onClick={redirectToGoogleAuth}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <HayaSpinner /> Signing you in...
    </div>
  );
};

export default function AuthCallbackHandlerWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <HayaSpinner />
        </div>
      }
    >
      <AuthCallbackHandler />
    </Suspense>
  );
}
