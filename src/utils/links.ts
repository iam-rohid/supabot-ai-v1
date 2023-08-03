import { cache } from "react";
import { getProjectBySlug } from "./projects";
import { db } from "@/lib/drizzle";
import { linksTable } from "@/lib/schema/links";
import { eq } from "drizzle-orm";

export const getLinksByProjectSlug = cache(async (projectSlug: string) => {
  const project = await getProjectBySlug(projectSlug);
  return db
    .select()
    .from(linksTable)
    .where(eq(linksTable.projectId, project.id));
});
