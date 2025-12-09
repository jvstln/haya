import { Check, X } from "lucide-react";
import {
  type Control,
  type FieldValues,
  type Path,
  useWatch,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { passwordRequirements } from "../auth.schema";

interface PasswordRequirementsProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  isInvalid?: boolean;
}

export const PasswordRequirements = <T extends FieldValues>({
  control,
  name,
  isInvalid,
}: PasswordRequirementsProps<T>) => {
  const password = useWatch({ control, name }) as string;

  return (
    <div className="mt-2 space-y-0.5 text-[10px]">
      <p>Password must satisfy the following:</p>
      {passwordRequirements.map((req) => {
        const isValid = req.regex.test(password || "");
        return (
          <div
            key={req.id}
            className={cn(
              "flex items-center gap-2 transition-colors",
              isValid
                ? "text-success"
                : isInvalid
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            {isValid ? <Check className="size-3" /> : <X className="size-3" />}
            <span>{req.label}</span>
          </div>
        );
      })}
    </div>
  );
};
