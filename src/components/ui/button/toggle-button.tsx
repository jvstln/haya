import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from ".";

type IconToggleButtonProps = React.ComponentProps<typeof Button> & {
  isActive?: boolean;
};

export function IconToggleButton({
  isActive,
  ...props
}: IconToggleButtonProps) {
  return (
    <Button
      type="button"
      appearance={isActive ? "solid" : "outline"}
      color={isActive ? "primary" : "secondary"}
      size="icon-sm"
      {...props}
    >
      <Plus
        className={cn(
          "transition-transform duration-200",
          isActive && "rotate-45", // Selected indicator style
        )}
      />
    </Button>
  );
}
