import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import * as AuthService from "./auth.service";
import { useAuthStore } from "./auth.store";

function useAuth() {
  const authStore = useAuthStore();

  return {
    ...authStore,
    isAuthenticated: !!authStore.accessToken,
  };
}

function useSignUpEmail() {
  return useMutation({
    mutationFn: AuthService.signUpEmail,
    onSuccess(data) {
      toast.success(data.message);
    },
    onError(error) {
      toast.error(`Error: ${error.message}`);
    },
  });
}

function useVerifyOtp() {
  return useMutation({
    mutationFn: AuthService.verifyOtp,
    onSuccess(data) {
      toast.success(data.message || "Email verified successfully");
    },
    onError(error) {
      toast.error(`Error: ${error.message}`);
    },
  });
}

function useResendVerification() {
  return useMutation({
    mutationFn: AuthService.resendVerification,
    onMutate: () => {
      toast.loading("Resending verification email...", {
        id: "resendVerification",
      });
    },
    onSuccess(data) {
      toast.success(data.message, { id: "resendVerification" });
    },
    onError(error) {
      toast.error(`Error: ${error.message}`, { id: "resendVerification" });
    },
  });
}

function useLogin() {
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: AuthService.login,
    onMutate: () => {
      toast.loading("Logging in...", {
        id: "login",
      });
    },
    onSuccess(data) {
      // Store tokens and user in auth store
      setAuth(data);
      toast.success("Login successful", { id: "login" });
    },
    onError(error) {
      toast.error(`Error: ${error.message}`, {
        id: "login",
      });
    },
  });
}

function useLogout() {
  const { resetAuth } = useAuth();

  return useMutation({
    mutationFn: AuthService.logout,
    onMutate: () => {
      toast.loading("Logging out...", {
        id: "logout",
      });
    },
    onSuccess() {
      resetAuth();
      toast.success("Logout successful", { id: "logout" });
      window.location.assign("/");
    },
    onError(error) {
      toast.error(`Error: ${error.message}`, {
        id: "logout",
      });
    },
  });
}

function useForgotPassword() {
  return useMutation({
    mutationFn: AuthService.forgotPassword,
    onMutate: () => {
      toast.loading("Sending reset email...", {
        id: "forgotPassword",
      });
    },
    onSuccess(data) {
      toast.success(data.message, { id: "forgotPassword" });
    },
    onError(error) {
      toast.error(`Error: ${error.message}`, { id: "forgotPassword" });
    },
  });
}

function useResetPassword() {
  return useMutation({
    mutationFn: AuthService.resetPassword,
    onMutate: () => {
      toast.loading("Resetting password...", {
        id: "resetPassword",
      });
    },
    onSuccess(data) {
      toast.success(data.message, { id: "resetPassword" });
    },
    onError(error) {
      toast.error(`Error: ${error.message}`, { id: "resetPassword" });
    },
  });
}

export {
  useAuth,
  useSignUpEmail,
  useVerifyOtp,
  useResendVerification,
  useLogin,
  useLogout,
  useForgotPassword,
  useResetPassword,
};
