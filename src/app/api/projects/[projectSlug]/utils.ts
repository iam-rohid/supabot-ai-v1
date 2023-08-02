import { ApiResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import {
  type WithAuthHandlerProps,
  type WithAuthProps,
  type BaseRequestHandler,
  withAuth,
  WithAuthContext,
} from "../../utilts";
import { Project, porjectsTable } from "@/lib/schema/projects";
import { ProjectUser, projectUsersTable } from "@/lib/schema/project-users";
import { db } from "@/lib/drizzle";
import { and, eq } from "drizzle-orm";

export type WithProjectContext = {
  params: {
    projectSlug: string;
  };
  project: Project;
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
        id: porjectsTable.id,
        createdAt: porjectsTable.createdAt,
        updatedAt: porjectsTable.updatedAt,
        name: porjectsTable.name,
        slug: porjectsTable.slug,
        description: porjectsTable.description,
        role: projectUsersTable.role,
      })
      .from(porjectsTable)
      .innerJoin(
        projectUsersTable,
        eq(projectUsersTable.projectId, porjectsTable.id),
      )
      .where(
        and(
          eq(porjectsTable.slug, ctx.params.projectSlug),
          eq(projectUsersTable.userId, ctx.session.user.id),
        ),
      );

    if (!project) {
      return NextResponse.json({
        success: false,
        error: "Project not found!",
      } satisfies ApiResponse);
    }

    if (
      extraProps.requireRoles &&
      extraProps.requireRoles.length > 0 &&
      !new Set(extraProps.requireRoles).has(project.role)
    ) {
      return NextResponse.json({
        success: false,
        error: "You don't have access!",
      } satisfies ApiResponse);
    }

    ctx.project = project;

    return handler(req, ctx);
  });
