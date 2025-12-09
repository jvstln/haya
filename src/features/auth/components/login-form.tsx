import { ArrowRight, Google } from "iconsax-reactjs";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { LoginEmail } from "../auth.type";

export const LoginForm = ({
  form,
  onSubmit,
  isLoading,
}: {
  form: UseFormReturn<LoginEmail>;
  onSubmit: (values: LoginEmail) => void;
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
        <DialogTitle className="text-h2 text-white">Login to Haya</DialogTitle>
        <DialogDescription className="text-sm">
          Welcome back. Sign in with your email account
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
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          <FieldError errors={[errors.password]} />
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
          Login
        </Button>
      </form>
    </div>
  );
};
