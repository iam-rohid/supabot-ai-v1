import type { ReactNode } from "react";
import ProjectsProvider from "@/components/projects-provider";
import AppHeader from "./app-header";
import { getAllProjects } from "@/utils/projects";
import { getSession } from "@/utils/session";
import type { Session } from "next-auth";
import HeaderMessage from "@/components/header-message";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = (await getSession()) as Session;
  const projects = await getAllProjects(session.user.id);

  return (
    <ProjectsProvider projects={projects}>
      <HeaderMessage />
      <AppHeader />
      {children}
    </ProjectsProvider>
  );
}
