import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Spinner } from "@/components/ui/spinner";
import { type Weekday, weekdays } from "@/lib/date.util";
import { useUpdatePersonasSettings } from "../project-persona.hook";
import type { PersonasSettings } from "../project-persona.type";

export const PersonasBehaviorSettings = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [_mode, setMode] = useState<"automatic" | "manual">("automatic");
  const [day, setDay] = useState<Weekday | null>(null);
  const updatePersonasSettings = useUpdatePersonasSettings();

  const handleUpdatePersonasSettings = (
    schedule: PersonasSettings["schedule"],
  ) => {
    updatePersonasSettings.mutate(
      { schedule, projectId },
      {
        onSuccess() {
          setMode(schedule.type);
          setDay("weekday" in schedule ? schedule.weekday : null);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Field orientation={"horizontal"}>
        <FieldContent>
          <FieldLabel>
            Analysis timing
            {updatePersonasSettings.isPending && <Spinner />}
          </FieldLabel>
          <FieldDescription>
            Set to receive behavioral analysis on preferred days
          </FieldDescription>
        </FieldContent>
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Select
          value={day}
          onValueChange={(value) => {
            if (value) {
              handleUpdatePersonasSettings({
                type: "automatic",
                weekday: value,
              });
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            {weekdays.map(({ weekday }) => (
              <SelectItem key={weekday} value={weekday}>
                {weekday}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          disabled={updatePersonasSettings.isPending}
          onClick={() => {
            handleUpdatePersonasSettings({ type: "manual" });
          }}
          className="w-full sm:w-auto"
        >
          Click to analyze now
        </Button>
      </div>
    </div>
  );
};
