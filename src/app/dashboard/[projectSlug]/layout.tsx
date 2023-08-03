import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { APP_NAME } from "@/lib/constants";
import { db } from "@/lib/drizzle";
import { projectInvitationsTable } from "@/lib/schema/project-invitations";
import { projectsTable } from "@/lib/schema/projects";
import { getProjectBySlug } from "@/utils/projects";
import { getSession } from "@/utils/session";
import { and, eq } from "drizzle-orm";
import { Session } from "next-auth";
import Link from "next/link";
import { ReactNode } from "react";
import AcceptInvitationModal from "./accept-invitation-modal";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { projectSlug: string };
}) {
  const session = (await getSession()) as Session;
  const [project] = await db
    .select({ id: projectsTable.id, name: projectsTable.name })
    .from(projectsTable)
    .where(eq(projectsTable.slug, params.projectSlug));
  const [isInvited] = await db
    .select({ expires: projectInvitationsTable.expires })
    .from(projectInvitationsTable)
    .where(
      and(
        eq(projectInvitationsTable.email, session.user.email!),
        eq(projectInvitationsTable.projectId, project.id),
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
