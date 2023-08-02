import ProjectNameCard from "./chatbot-name-card";
import ProjectSlugCard from "./chatbot-slug-card";
import ProjectDeleteCard from "./chatbot-delete-card";
import { db } from "@/lib/drizzle";
import { porjectsTable } from "@/lib/schema/chatbots";
import { eq } from "drizzle-orm";

export default async function GeneralProjectSettings({
  params,
}: {
  params: { project_slug: string };
}) {
  const [project] = await db
    .select()
    .from(porjectsTable)
    .where(eq(porjectsTable.slug, params.project_slug));

  return (
    <div className="grid gap-8">
      <ProjectNameCard project={project} />
      <ProjectSlugCard project={project} />
      <ProjectDeleteCard project={project} />
    </div>
  );
}
