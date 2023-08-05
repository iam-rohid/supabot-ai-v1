import "server-only";
import { db } from "@/lib/db";
import { projectUsersTable } from "@/lib/schema/project-users";
import { projectsTable } from "@/lib/schema/projects";
import { eq, desc } from "drizzle-orm";
import { cache } from "react";
import { usersTable } from "@/lib/schema/users";
import { projectInvitationsTable } from "@/lib/schema/project-invitations";

export const revalidate = 3600;

export const getAllProjects = cache(async (userId: string) => {
  console.log("getAllProjects", { userId });
  const projects = await db
    .select({
      id: projectsTable.id,
      updatedAt: projectsTable.updatedAt,
      createdAt: projectsTable.createdAt,
      slug: projectsTable.slug,
      name: projectsTable.name,
      description: projectsTable.description,
    })
    .from(projectUsersTable)
    .innerJoin(projectsTable, eq(projectsTable.id, projectUsersTable.projectId))
    .where(eq(projectUsersTable.userId, userId))
    .orderBy(desc(projectsTable.updatedAt));
  return projects;
});

export const getProjectBySlug = cache(async (projectSlug: string) => {
  console.log("getProjectBySlug", { projectSlug });
  const [project] = await db
    .select({
      id: projectsTable.id,
      updatedAt: projectsTable.updatedAt,
      createdAt: projectsTable.createdAt,
      slug: projectsTable.slug,
      name: projectsTable.name,
      description: projectsTable.description,
    })
    .from(projectsTable)
    .where(eq(projectsTable.slug, projectSlug));
  return project;
});

export const getProjectById = cache(async (projectId: string) => {
  console.log("getProjectById", { projectId });
  const [project] = await db
    .select({
      id: projectsTable.id,
      updatedAt: projectsTable.updatedAt,
      createdAt: projectsTable.createdAt,
      slug: projectsTable.slug,
      name: projectsTable.name,
      description: projectsTable.description,
    })
    .from(projectsTable)
    .where(eq(projectsTable.id, projectId));
  return project;
});

export const getMembersByProjectId = cache(async (projectId: string) => {
  const members = await db
    .select({
      userId: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      image: usersTable.image,
      role: projectUsersTable.role,
      joinedAt: projectUsersTable.createdAt,
    })
    .from(projectUsersTable)
    .innerJoin(usersTable, eq(usersTable.id, projectUsersTable.userId))
    .where(eq(projectUsersTable.projectId, projectId))
    .orderBy(projectUsersTable.createdAt);
  return members;
});

export const getInvitationsByProjectId = cache(async (projectId: string) => {
  const invitations = await db
    .select()
    .from(projectInvitationsTable)
    .where(eq(projectInvitationsTable.projectId, projectId))
    .orderBy(desc(projectInvitationsTable.createdAt));
  return invitations;
});
