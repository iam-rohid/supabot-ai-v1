import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { linksTable } from "@/lib/schema/links";
import { eq } from "drizzle-orm";

export const revalidate = 3600;

export const getLinksByProjectId = cache(async (projectId: string) => {
  console.log("getLinksByProjectId", { projectId });
  const links = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.projectId, projectId));
  return links;
});
