import { ReactNode } from "react";
import ProjectsProvider from "@/components/chatbots-provider";
import AppHeader from "./app-header";
import { db } from "@/lib/drizzle";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { porjectsTable } from "@/lib/schema/chatbots";
import { projectUsersTable } from "@/lib/schema/chatbot-users";
import { desc, eq } from "drizzle-orm";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = (await getServerSession(authOptions)) as Session;
  const projects = await db
    .select({
      id: porjectsTable.id,
      slug: porjectsTable.slug,
      name: porjectsTable.name,
    })
    .from(projectUsersTable)
    .innerJoin(porjectsTable, eq(porjectsTable.id, projectUsersTable.projectId))
    .where(eq(projectUsersTable.userId, session.user.id))
    .orderBy(desc(porjectsTable.name));

  return (
    <ProjectsProvider projects={projects}>
      <AppHeader />
      {children}
    </ProjectsProvider>
  );
}
