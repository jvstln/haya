import { ProjectSettingsPage } from "@/features/projects/components/project-settings-page";

const ProjectSettingsRoute = async ({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) => {
  const { projectId } = await params;

  return <ProjectSettingsPage projectId={projectId} />;
};

export default ProjectSettingsRoute;
