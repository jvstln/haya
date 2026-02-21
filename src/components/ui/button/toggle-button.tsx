import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from ".";

type IconToggleButtonProps = React.ComponentProps<typeof Button> & {
  isSelected?: boolean;
};

export function IconToggleButton({
  isSelected,
  ...props
}: IconToggleButtonProps) {
  return (
    <Button
      type="button"
      appearance={isSelected ? "solid" : "outline"}
      color={isSelected ? "primary" : "secondary"}
      size="icon-sm"
      {...props}
    >
      <Plus
        className={cn(
          "transition-transform duration-200",
          isSelected && "rotate-45", // Selected indicator style
        )}
      />
    </Button>
  );
}
