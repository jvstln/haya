import { SessionsPage } from "@/features/projects/components/project-sessions/sessions-page";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

const ProjectSessionsRoute = async ({ params }: PageProps) => {
  const { projectId } = await params;

  return <SessionsPage projectId={projectId} />;
};

export default ProjectSessionsRoute;
