import { cache } from "react";
import { db } from "@/lib/drizzle";
import { linksTable } from "@/lib/schema/links";
import { eq } from "drizzle-orm";
import { projectsTable } from "@/lib/schema/projects";

export const getLinksByProjectSlug = cache(async (projectSlug: string) => {
  const [project] = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(eq(projectsTable.slug, projectSlug));
  return db
    .select()
    .from(linksTable)
    .where(eq(linksTable.projectId, project.id));
});
