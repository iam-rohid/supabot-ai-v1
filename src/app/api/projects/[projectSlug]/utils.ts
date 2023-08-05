import { ApiResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import {
  type WithAuthHandlerProps,
  type WithAuthProps,
  type BaseRequestHandler,
  withAuth,
  WithAuthContext,
} from "../../utilts";
import { Project, projectsTable } from "@/lib/schema/projects";
import { ProjectUser, projectUsersTable } from "@/lib/schema/project-users";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import {
  ProjectInvitation,
  projectInvitationsTable,
} from "@/lib/schema/project-invitations";

export type WithProjectContext = {
  params: {
    projectSlug: string;
  };
  projectId: string;
  projectName: Project["name"];
  memberRole?: ProjectUser["role"];
  invitation?: ProjectInvitation;
} & WithAuthContext;

export type WithProjectHandlerProps = WithAuthHandlerProps & {};
export type WithProjectProps = WithAuthProps & {
  requireRoles?: ProjectUser["role"][];
};

export const withProject = <C extends WithProjectContext>(
  handler: BaseRequestHandler<C, WithProjectHandlerProps>,
  extraProps: WithProjectProps = {},
) =>
  withAuth<C>(async (req, ctx) => {
    const [project] = await db
      .select({
        id: projectsTable.id,
        name: projectsTable.name,
      })
      .from(projectsTable)
      .where(eq(projectsTable.slug, ctx.params.projectSlug));

    const [member] = await db
      .select({ role: projectUsersTable.role })
      .from(projectUsersTable)
      .where(
        and(
          eq(projectUsersTable.projectId, project.id),
          eq(projectUsersTable.userId, ctx.session.user.id),
        ),
      );
    const [invitation] = await db
      .select()
      .from(projectInvitationsTable)
      .where(
        and(
          eq(projectInvitationsTable.email, ctx.session.user.email!),
          eq(projectInvitationsTable.projectId, project.id),
        ),
      );
    if (!member && !invitation) {
      return NextResponse.json({
        success: false,
        error: "Project not found!",
      } satisfies ApiResponse);
    }

    if (
      member &&
      extraProps.requireRoles &&
      extraProps.requireRoles.length > 0 &&
      !new Set(extraProps.requireRoles).has(member.role)
    ) {
      return NextResponse.json({
        success: false,
        error: "You don't have access!",
      } satisfies ApiResponse);
    }

    ctx.projectId = project.id;
    ctx.projectName = project.name;
    ctx.memberRole = member?.role;
    ctx.invitation = invitation;

    return handler(req, ctx);
  });
