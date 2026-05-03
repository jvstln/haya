import { ArrowDown2, ArrowUp2 } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import { Button } from ".";

type StepperButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
> & {
  onIncrement?: () => void;
  onDecrement?: () => void;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: 1 | -1,
  ) => void;
  // classNames?: Partial<Record<"root" | "increment" | "decrement", string>>;
};

export function StepperButton({
  onIncrement,
  onDecrement,
  onClick,
  className,
  ...props
}: StepperButtonProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Button
        appearance={"ghost"}
        color={"secondary"}
        size={"sm"}
        type="button"
        onClick={(e) => {
          onIncrement?.();
          onClick?.(e, 1);
        }}
        {...props}
      >
        <ArrowUp2 />
      </Button>
      <Button
        appearance={"ghost"}
        color={"secondary"}
        size={"sm"}
        type="button"
        onClick={(e) => {
          onDecrement?.();
          onClick?.(e, -1);
        }}
        {...props}
      >
        <ArrowDown2 />
      </Button>
    </div>
  );
}
