import PageHeader from "@/components/page-header";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import { Suspense } from "react";
import NewProjectButton from "@/components/new-chatbot-button";
import { db } from "@/lib/drizzle";
import { porjectsTable } from "@/lib/schema/chatbots";
import { desc, eq } from "drizzle-orm";
import { projectUsersTable } from "@/lib/schema/chatbot-users";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

export const metadata: Metadata = {
  title: `Projects | ${APP_NAME}`,
};

export default async function AppPage() {
  return (
    <>
      <PageHeader title="Overview">
        <NewProjectButton />
      </PageHeader>
      <main className="container py-8">
        <Suspense fallback={<ProjectListLoadingSkeletion />}>
          <ProjectList />
        </Suspense>
      </main>
    </>
  );
}

function ProjectListLoadingSkeletion() {
  return (
    <div className="grid grid-cols-3 gap-8">
      {new Array(4).fill(1).map((_, i) => (
        <Skeleton key={i} className="h-36" />
      ))}
    </div>
  );
}

async function ProjectList() {
  const session = (await getServerSession(authOptions)) as Session;
  const projects = await db
    .select({
      id: porjectsTable.id,
      name: porjectsTable.name,
      slug: porjectsTable.slug,
      description: porjectsTable.description,
      updatedAt: porjectsTable.updatedAt,
    })
    .from(projectUsersTable)
    .innerJoin(porjectsTable, eq(porjectsTable.id, projectUsersTable.projectId))
    .where(eq(projectUsersTable.userId, session.user.id))
    .orderBy(desc(porjectsTable.updatedAt));

  if (projects.length === 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>You don&apos;t have any chatbots yet!</CardTitle>
        </CardHeader>
        <CardContent>
          <Image
            src="/assets/empty-artwork.svg"
            width={512}
            height={512}
            className="max-h-64 w-full object-contain"
            alt="Empty Artwork"
          />
        </CardContent>
        <CardFooter className="justify-center">
          <NewProjectButton label="Create a chatbot" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      {projects.map((project) => (
        <Link
          key={project.slug}
          href={`/dashboard/${project.slug}`}
          className="group"
        >
          <Card className="group-hover:border-foreground/20">
            <CardHeader>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription>
                {project.description || "No description"}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Last updated{" "}
                {formatDistanceToNow(new Date(project.updatedAt), {
                  addSuffix: true,
                })}
              </p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
