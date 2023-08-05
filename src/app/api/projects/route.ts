import type { ApiResponse } from "@/lib/types";
import {
  CreateProjectSchemaData,
  createProjectSchema,
} from "@/lib/validations";
import { NextResponse } from "next/server";
import { withAuth } from "../utilts";
import { projectsTable } from "@/lib/schema/projects";
import { db } from "@/lib/db";
import { projectUsersTable } from "@/lib/schema/project-users";
import { eq } from "drizzle-orm";
import type { Project } from "@/lib/types/db-types";

export const GET = withAuth(async (req, ctx) => {
  try {
    const projects = await db
      .select({
        id: projectsTable.id,
        createdAt: projectsTable.createdAt,
        updatedAt: projectsTable.updatedAt,
        name: projectsTable.name,
        slug: projectsTable.slug,
        description: projectsTable.description,
      })
      .from(projectUsersTable)
      .innerJoin(
        projectsTable,
        eq(projectsTable.id, projectUsersTable.projectId),
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
    const [project] = await db.insert(projectsTable).values(data).returning();
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
