import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import Link, { type LinkProps as LinkPrimitiveProps } from "next/link";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { themeColors } from "../../../lib/color.util";
import { Spinner } from "../spinner";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-disabled:pointer-events-none dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      appearance: {
        solid: "bg-(--bg) text-(--fg)",
        ghost: "bg-transparent text-(--fg) hover:bg-(--bg)",
        outline:
          "border border-(--bg) bg-transparent text-(--fg) hover:bg-(--bg)",
        link: "text-(--bg) underline-offset-4 hover:underline",
        soft: "bg-(--bg)/15 text-(--bg) hover:bg-(--bg)/25",
      },
      color: {
        primary: themeColors.primary,
        secondary: themeColors.secondary,
        destructive: themeColors.destructive,
        success: themeColors.success,
        warning: themeColors.warning,
        info: themeColors.info,
        colorful: themeColors.colorful,
      },
      size: {
        default: "h-8.75 px-6 py-2 text-sm has-[>svg]:px-3",
        sm: "h-7 gap-1.5 px-3 font-semibold text-xs has-[>svg]:px-2.5",
        lg: "h-12.75 px-6 font-bold has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-6",
        icon: "size-8.75 text-sm",
        "icon-sm": "size-8 text-xs",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      appearance: "solid",
      color: "primary",
      // variant: "default",
      size: "default",
    },
  },
);

declare namespace Button {
  type ButtonVariantProps = VariantProps<typeof buttonVariants>;
  type ButtonBaseProps = ButtonVariantProps & {
    isLoading?: boolean;
    loadingText?: string;
  };

  type ButtonProps = ButtonBaseProps & ButtonPrimitive.Props & { href?: never };
  type LinkButtonProps<TLink = string> = ButtonBaseProps &
    LinkPrimitiveProps<TLink> & { disabled?: boolean };
  type Props = ButtonProps | LinkButtonProps;
}

function Button(props: Button.ButtonProps): React.JSX.Element;
function Button<TLink>(props: Button.LinkButtonProps<TLink>): React.JSX.Element;
function Button({
  // Variants
  appearance,
  color,
  size,

  className,
  isLoading,
  loadingText,
  children: defaultChildren,
  ...props
  // biome-ignore lint/suspicious/noExplicitAny: any type  is safe when used in function overloading
}: any) {
  const componentProps = {
    "data-size": size,
    "data-appearance": appearance,
    "data-color": color,
    className: cn(buttonVariants({ appearance, color, size, className })),
    disabled: props.disabled || isLoading,
    children: isLoading ? (
      <>
        <Spinner />
        {loadingText}
      </>
    ) : (
      defaultChildren
    ),
  };

  if ("href" in props && props.href) {
    return (
      <Link
        data-slot="link-button"
        data-disabled={componentProps.disabled}
        tabIndex={componentProps.disabled ? -1 : props.tabIndex}
        aria-disabled={componentProps.disabled ? true : undefined}
        {...props}
        {...componentProps}
      />
    );
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      focusableWhenDisabled={componentProps.disabled}
      {...props}
      {...componentProps}
    />
  );
}

export { Button, buttonVariants };
export * from "./stepper-button";
export * from "./toggle-button";
