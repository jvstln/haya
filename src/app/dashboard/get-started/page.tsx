import { DashboardSlot } from "@/components/dashboard-ui";
import { NewProjectForm } from "@/features/projects/components/new-project-form";

export default function GetStarted() {
  return (
    <DashboardSlot>
      <NewProjectForm />
    </DashboardSlot>
  );
}
