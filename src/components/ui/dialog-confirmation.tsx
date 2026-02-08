"use client";
import { useState } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

type ConfirmationDialogProps = React.ComponentProps<typeof Dialog> & {
  image?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  buttonText?: React.ReactNode;
  /**Function to run when the user confirms the operation
   * For async functions, the dialog remains until the function is resolved.
   * You can also prevent the dialog from closing using `e.preventDefault()` and then manually close it using `setOpen(false)`
   */
  onConfirm?: (
    e: React.MouseEvent,
    setOpen: (open: boolean) => void,
  ) => Promise<void>;
  onCancel?: (
    e: React.MouseEvent,
    setOpen: (open: boolean) => void,
  ) => Promise<void>;
  accent?: `--color-${string}-${number}`;
};

export const ConfirmationDialog = ({
  children,
  image,
  title = "Are you sure you want to perform this operation?",
  description,
  onConfirm,
  onCancel,
  buttonText = "Proceed",
  accent = "--color-amber-600",
  ...props
}: ConfirmationDialogProps) => {
  const [_open, _setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const open = props.open || _open;
  const onOpenChange = (open: boolean) => {
    if (isPending) return;
    props.onOpenChange?.(open);
    _setOpen(open);
  };

  return (
    <Dialog {...props} open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="sm:text-center">
          {image || (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              className="mx-auto size-16"
              style={{ color: `var(${accent})` }}
            >
              <title>Confirm Action Icon</title>
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1m-1.108 7.935c.23-.453.4-.668.541-.78c.106-.084.25-.155.567-.155c.625 0 1 .47 1 .978c0 .278-.054.416-.202.592c-.207.246-.59.545-1.348 1.046l-.45.296V13a1 1 0 1 0 2 0v-1.017c.542-.374.997-.732 1.327-1.124c.477-.566.673-1.17.673-1.881C15 7.508 13.867 6 12 6c-.684 0-1.289.176-1.808.587c-.484.383-.814.91-1.084 1.445a1 1 0 1 0 1.784.903M13 16.5a1 1 0 1 0-2 0v.5a1 1 0 1 0 2 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <DialogTitle style={{ color: `var(${accent})` }}>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            appearance="outline"
            disabled={isPending}
            onClick={async (e) => {
              await onCancel?.(e, onOpenChange);
              if (!e.defaultPrevented) onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async (e) => {
              setIsPending(true);
              try {
                await onConfirm?.(e, onOpenChange);
              } finally {
                setIsPending(false);
                if (!e.defaultPrevented) onOpenChange(false);
              }
            }}
            isLoading={isPending}
            color="destructive"
            style={{ "--bg": `var(${accent})` } as React.CSSProperties}
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
