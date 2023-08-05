import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import { projectUsersTable } from "@/lib/schema/project-users";
import { projectsTable } from "@/lib/schema/projects";
import { usersTable } from "@/lib/schema/users";
import { getProjectBySlug } from "@/utils/projects";
import { getSession } from "@/utils/session";
import { format, formatDistanceToNow } from "date-fns";
import { eq } from "drizzle-orm";
import { MoreVertical, UserIcon } from "lucide-react";
import { Session } from "next-auth";
import { Suspense, cache } from "react";
import InviteUserButton from "./invite-user-button";
import { projectInvitationsTable } from "@/lib/schema/project-invitations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MemberRowActionDropdownButton from "./member-row-action-dropdown-button";
import InvitationRowActionDropdownButton from "./invitation-row-action-dropdown-button";

export default async function PeoplePage({
  params,
}: {
  params: { projectSlug: string };
}) {
  const session = (await getSession()) as Session;
  const project = await getProjectBySlug(session.user.id, params.projectSlug);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex-row items-center space-x-6 space-y-0">
          <div className="flex-1 space-y-1.5">
            <CardTitle>People</CardTitle>
            <CardDescription>
              Teammates or friends that have access to this project.
            </CardDescription>
          </div>
          <InviteUserButton projectSlug={params.projectSlug} />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="members">
            <TabsList>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
            </TabsList>
            <TabsContent value="members">
              <Suspense fallback={<p>Loading...</p>}>
                <ProjectMembersList
                  projectSlug={params.projectSlug}
                  projectId={project.id}
                />
              </Suspense>
            </TabsContent>
            <TabsContent value="invitations">
              <Suspense fallback={<p>Loading...</p>}>
                <ProjectInvitationsList
                  projectSlug={params.projectSlug}
                  projectId={project.id}
                />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

const getMembersByProjectId = cache(async (projectId: string) =>
  db
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
    .orderBy(projectUsersTable.createdAt),
);

async function ProjectMembersList({
  projectId,
  projectSlug,
}: {
  projectId: string;
  projectSlug: string;
}) {
  const members = await getMembersByProjectId(projectId);
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>USER</TableHead>
            <TableHead>ROLE</TableHead>
            <TableHead>JOINED AT</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.userId}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={member.image || `/api/avatar/${member.userId}`}
                    />
                    <AvatarFallback>
                      <UserIcon className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium leading-none">
                      {member.name || member.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="uppercase">{member.role}</TableCell>
              <TableCell>
                {format(new Date(member.joinedAt), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                <MemberRowActionDropdownButton userId={member.userId} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const getInvitationsByProjectId = cache(async (projectId: string) =>
  db
    .select()
    .from(projectInvitationsTable)
    .where(eq(projectInvitationsTable.projectId, projectId))
    .orderBy(projectInvitationsTable.createdAt),
);

async function ProjectInvitationsList({
  projectId,
  projectSlug,
}: {
  projectId: string;
  projectSlug: string;
}) {
  const invitations = await getInvitationsByProjectId(projectId);

  if (invitations.length === 0) {
    return (
      <div className="space-y-6 p-6 text-center">
        <p className="text-muted-foreground">
          You haven&apos;t invited anyone yet!
        </p>
        <InviteUserButton projectSlug={projectSlug} label="Invite a teammate" />
      </div>
    );
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>EMAIL</TableHead>
            <TableHead>ROLE</TableHead>
            <TableHead>INVITED AT</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => (
            <TableRow key={invitation.email}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell className="uppercase">{invitation.role}</TableCell>
              <TableCell>
                {format(new Date(invitation.createdAt), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                <InvitationRowActionDropdownButton
                  projectSlug={projectSlug}
                  invitation={invitation}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
