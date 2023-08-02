import type { ApiResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { withProject } from "./utils";
import { Project, porjectsTable } from "@/lib/schema/projects";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";

export const GET = withProject(async (req, ctx) => {
  return NextResponse.json({
    success: true,
    data: ctx.project,
  } satisfies ApiResponse<Project>);
});

export const PUT = withProject(
  async (req, ctx) => {
    const { name, slug, description } = await req.json();
    try {
      const [project] = await db
        .update(porjectsTable)
        .set({
          ...(typeof name === "string" ? { name } : {}),
          ...(typeof slug === "string" ? { slug } : {}),
          ...(typeof description === "string" ? { description } : {}),
          updatedAt: new Date(),
        })
        .where(eq(porjectsTable.slug, ctx.params.projectSlug))
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
  async (req, ctx) => {
    try {
      const [project] = await db
        .delete(porjectsTable)
        .where(eq(porjectsTable.slug, ctx.params.projectSlug))
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
