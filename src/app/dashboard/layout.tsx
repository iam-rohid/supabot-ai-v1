import { ReactNode } from "react";
import ProjectsProvider from "@/components/projects-provider";
import AppHeader from "./app-header";
import { getAllProjects } from "@/utils/projects";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const projects = await getAllProjects();

  return (
    <ProjectsProvider projects={projects}>
      <AppHeader />
      {children}
    </ProjectsProvider>
  );
}
