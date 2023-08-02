import type { ApiResponse } from "@/lib/types";
import {
  CreateProjectSchemaData,
  createProjectSchema,
} from "@/lib/validations";
import { NextResponse } from "next/server";
import { withAuth } from "../utilts";
import { Project, porjectsTable } from "@/lib/schema/projects";
import { db } from "@/lib/drizzle";
import { projectUsersTable } from "@/lib/schema/project-users";
import { eq } from "drizzle-orm";

export const GET = withAuth(async (req, ctx) => {
  try {
    const projects = await db
      .select({
        id: porjectsTable.id,
        createdAt: porjectsTable.createdAt,
        updatedAt: porjectsTable.updatedAt,
        name: porjectsTable.name,
        slug: porjectsTable.slug,
        description: porjectsTable.description,
      })
      .from(projectUsersTable)
      .innerJoin(
        porjectsTable,
        eq(porjectsTable.id, projectUsersTable.projectId),
      )
      .where(eq(projectUsersTable.userId, ctx.session.user.id));

    return NextResponse.json({
      success: true,
      data: projects,
    } satisfies ApiResponse<Project[]>);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to load projects",
    } satisfies ApiResponse<Project[]>);
  }
});

export const POST = withAuth(async (req, ctx) => {
  const body = await req.json();

  let data: CreateProjectSchemaData;
  try {
    data = await createProjectSchema.parseAsync(body);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid credentials",
      } satisfies ApiResponse,
      { status: 400 },
    );
  }

  try {
    const [project] = await db.insert(porjectsTable).values(data).returning();
    await db.insert(projectUsersTable).values({
      projectId: project.id,
      userId: ctx.session.user.id,
      role: "owner",
    });

    return NextResponse.json({
      success: true,
      message: "Project created",
      data: project,
    } satisfies ApiResponse<Project>);
  } catch (error: any) {
    console.error("Failed to create project: ", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Project slug is already in use.",
        } satisfies ApiResponse,
        { status: 422 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project",
      } satisfies ApiResponse,
      { status: 400 },
    );
  }
});
