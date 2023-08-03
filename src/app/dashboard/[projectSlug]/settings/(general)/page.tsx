import ProjectNameCard from "./project-name-card";
import ProjectSlugCard from "./project-slug-card";
import ProjectDeleteCard from "./project-delete-card";
import { getProjectBySlug } from "@/utils/projects";
import { getSession } from "@/utils/session";
import { Session } from "next-auth";

export default async function GeneralProjectSettings({
  params,
}: {
  params: { projectSlug: string };
}) {
  const session = (await getSession()) as Session;
  const project = await getProjectBySlug(session.user.id, params.projectSlug);

  return (
    <div className="grid gap-8">
      <ProjectNameCard projectName={project.name} />
      <ProjectSlugCard />
      <ProjectDeleteCard />
    </div>
  );
}
