import { useId, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export const PersonaBehaviorSettings = () => {
  const [mode, setMode] = useState<"automatic" | "manual">("automatic");
  const [day, setDay] = useState<string>("");

  const autoId = useId();
  const manualId = useId();

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Automatic Option Row */}
      <Field orientation={"horizontal"}>
        <FieldContent>
          <FieldLabel htmlFor={autoId}>Automatic</FieldLabel>
          <FieldDescription>
            Set to receive behavioral analysis every Fridays
          </FieldDescription>
        </FieldContent>

        <Checkbox
          id={autoId}
          checked={mode === "automatic"}
          onCheckedChange={(checked) => {
            if (checked) setMode("automatic");
          }}
        />
      </Field>

      <Separator />

      <div className="flex flex-col gap-2">
        <Field orientation={"horizontal"}>
          <FieldContent>
            <FieldLabel htmlFor={manualId}>Manual</FieldLabel>
            <FieldDescription>
              Set to receive behavioral analysis on preferred days
            </FieldDescription>
          </FieldContent>
          <Checkbox
            id={manualId}
            checked={mode === "manual"}
            onCheckedChange={(checked) => {
              if (checked) setMode("manual");
            }}
          />
        </Field>

        <Select value={day} onValueChange={(val) => val && setDay(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            {daysOfWeek.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
