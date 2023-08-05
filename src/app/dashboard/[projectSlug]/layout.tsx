import { db } from "@/lib/db";
import { projectInvitationsTable } from "@/lib/schema/project-invitations";
import { getProjectBySlug } from "@/utils/projects";
import { getSession } from "@/utils/session";
import { and, eq } from "drizzle-orm";
import type { Session } from "next-auth";
import type { ReactNode } from "react";
import AcceptInvitationModal from "./accept-invitation-modal";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { projectSlug: string };
}) {
  const session = (await getSession()) as Session;
  const project = await getProjectBySlug(params.projectSlug);
  const [isInvited] = await db
    .select({ expires: projectInvitationsTable.expires })
    .from(projectInvitationsTable)
    .where(
      and(
        eq(projectInvitationsTable.projectId, project.id),
        eq(projectInvitationsTable.email, session.user.email!),
      ),
    );

  if (isInvited) {
    return (
      <AcceptInvitationModal
        projectName={project.name}
        projectSlug={params.projectSlug}
        userEmail={session.user.email!}
      />
    );
  }
  return <>{children}</>;
}
