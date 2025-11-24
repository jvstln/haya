import { redirect } from "next/navigation";

export default async ({ params }: PageProps<"/dashboard/audits/[auditId]">) => {
  const { auditId } = await params;
  redirect(`/dashboard/audits/${auditId}/case`);
};
