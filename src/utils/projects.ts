import { db } from "@/lib/drizzle";
import { projectUsersTable } from "@/lib/schema/project-users";
import { porjectsTable } from "@/lib/schema/projects";
import { eq, desc, and } from "drizzle-orm";
import { cache } from "react";
import { getSession } from "./session";

export const getAllProjects = cache(async () => {
  const session = await getSession();
  if (!session) {
    throw "UNAUTHORIZED";
  }
  return db
    .select({
      id: porjectsTable.id,
      slug: porjectsTable.slug,
      name: porjectsTable.name,
      description: porjectsTable.description,
      updatedAt: porjectsTable.updatedAt,
    })
    .from(projectUsersTable)
    .innerJoin(porjectsTable, eq(porjectsTable.id, projectUsersTable.projectId))
    .where(eq(projectUsersTable.userId, session.user.id))
    .orderBy(desc(porjectsTable.updatedAt));
});

export const getProjectBySlug = cache(async (slug: string) => {
  const session = await getSession();
  if (!session) {
    throw "UNAUTHORIZED";
  }
  const [project] = await db
    .select({
      id: porjectsTable.id,
      slug: porjectsTable.slug,
      name: porjectsTable.name,
      description: porjectsTable.description,
      updatedAt: porjectsTable.updatedAt,
    })
    .from(projectUsersTable)
    .innerJoin(porjectsTable, eq(porjectsTable.id, projectUsersTable.projectId))
    .where(
      and(
        eq(projectUsersTable.userId, session.user.id),
        eq(porjectsTable.slug, slug),
      ),
    )
    .orderBy(desc(porjectsTable.updatedAt));
  return project;
});
