import ProjectNameCard from "./project-name-card";
import ProjectSlugCard from "./project-slug-card";
import ProjectDeleteCard from "./project-delete-card";
import { getProjectBySlug } from "@/utils/projects";
import { notFound } from "next/navigation";

export default async function GeneralProjectSettings({
  params,
}: {
  params: { projectSlug: string };
}) {
  const project = await getProjectBySlug(params.projectSlug);

  if (!project) {
    notFound();
  }

  return (
    <div className="grid gap-8">
      <ProjectNameCard projectName={project.name} />
      <ProjectSlugCard />
      <ProjectDeleteCard />
    </div>
  );
}
