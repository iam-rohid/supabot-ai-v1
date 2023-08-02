"use client";

import { useQuery } from "@tanstack/react-query";
import { type ReactNode, createContext, useContext, useMemo } from "react";
import type { ApiResponse } from "@/lib/types";
import { Project } from "@/lib/schema/chatbots";
import { useSession } from "next-auth/react";

export type ProjectsContextType = {
  projects: { id: string; slug: string; name: string }[];
  isLoading?: boolean;
};

export const ProjectsContext = createContext<ProjectsContextType | null>(null);

const fetchProjectsFn = async () => {
  const res = await fetch("/api/chatbots");
  const body: ApiResponse<Project[]> = await res.json();
  if (!body.success) {
    throw body.error;
  }
  return body.data;
};

export default function ProjectsProvider({
  children,
  projects: initialData = [],
}: {
  children: ReactNode;
  projects?: ProjectsContextType["projects"];
}) {
  const { data } = useSession();
  const projectsQuery = useQuery<ProjectsContextType["projects"]>({
    queryKey: ["projects", data?.user.id],
    queryFn: fetchProjectsFn,
    initialData,
  });

  const projects = useMemo(
    () => (projectsQuery.isSuccess ? projectsQuery.data : []),
    [projectsQuery.data, projectsQuery.isSuccess],
  );

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isLoading: projectsQuery.isLoading,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw "useProjects must use inside a ProjectsProvider";
  }
  return context;
};
