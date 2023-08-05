import { db } from "@/lib/db";
import { projectUsersTable } from "@/lib/schema/project-users";
import { projectsTable } from "@/lib/schema/projects";
import { eq, desc, and } from "drizzle-orm";
import { cache } from "react";

export const getAllProjects = cache(async (userId: string) => {
  return db
    .select({
      id: projectsTable.id,
      slug: projectsTable.slug,
      name: projectsTable.name,
      description: projectsTable.description,
      updatedAt: projectsTable.updatedAt,
    })
    .from(projectUsersTable)
    .innerJoin(projectsTable, eq(projectsTable.id, projectUsersTable.projectId))
    .where(eq(projectUsersTable.userId, userId))
    .orderBy(desc(projectsTable.updatedAt));
});

export const getProjectBySlug = cache(
  async (userId: string, projectSlug: string) => {
    const [project] = await db
      .select({
        id: projectsTable.id,
        slug: projectsTable.slug,
        name: projectsTable.name,
        description: projectsTable.description,
        updatedAt: projectsTable.updatedAt,
      })
      .from(projectUsersTable)
      .innerJoin(
        projectsTable,
        eq(projectsTable.id, projectUsersTable.projectId),
      )
      .where(
        and(
          eq(projectUsersTable.userId, userId),
          eq(projectsTable.slug, projectSlug),
        ),
      )
      .orderBy(desc(projectsTable.updatedAt));
    return project;
  },
);
