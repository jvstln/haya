import { ProjectDetailsPage } from "@/features/projects/components/project-details-page";

const ProjectDetails = async ({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) => {
  const { projectId } = await params;

  return <ProjectDetailsPage projectId={projectId} />;
};

export default ProjectDetails;
