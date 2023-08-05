import type { ApiResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { withProject } from "./utils";
import { projectsTable } from "@/lib/schema/projects";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import type { Project } from "@/lib/types/db-types";

export const GET = withProject(async (_, ctx) => {
  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, ctx.projectId));
  return NextResponse.json({
    success: true,
    data: project,
  } satisfies ApiResponse<Project>);
});

export const PUT = withProject(
  async (req, ctx) => {
    const { name, slug, description } = await req.json();
    try {
      const [project] = await db
        .update(projectsTable)
        .set({
          ...(typeof name === "string" ? { name } : {}),
          ...(typeof slug === "string" ? { slug } : {}),
          ...(typeof description === "string" ? { description } : {}),
          updatedAt: new Date(),
        })
        .where(eq(projectsTable.slug, ctx.params.projectSlug))
        .returning();
      return NextResponse.json({
        success: true,
        message: "Project updated!",
        data: project,
      } satisfies ApiResponse<Project>);
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update project",
        } satisfies ApiResponse,
        { status: 400 },
      );
    }
  },
  { requireRoles: ["owner", "admin"] },
);

export const DELETE = withProject(
  async (_, ctx) => {
    try {
      const [project] = await db
        .delete(projectsTable)
        .where(eq(projectsTable.id, ctx.projectId))
        .returning();
      return NextResponse.json({
        success: true,
        message: "Project deleted!",
        data: project,
      } satisfies ApiResponse<Project>);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete project",
        } satisfies ApiResponse,
        { status: 400 },
      );
    }
  },
  { requireRoles: ["owner"] },
);
