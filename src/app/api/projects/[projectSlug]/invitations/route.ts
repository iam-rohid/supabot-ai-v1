import { NextResponse } from "next/server";
import { withProject } from "../utils";
import { ApiResponse } from "@/lib/types";
import { db } from "@/lib/db";
import { projectUsersTable } from "@/lib/schema/project-users";
import { usersTable } from "@/lib/schema/users";
import { and, eq } from "drizzle-orm";
import {
  ProjectInvitation,
  projectInvitationsTable,
} from "@/lib/schema/project-invitations";
import { randomBytes } from "crypto";
import { verificationTokensTable } from "@/lib/schema/verification-tokens";
import { sendEmail } from "@/lib/emails";
import { APP_NAME } from "@/lib/constants";
import ProjectInvitationEmail from "@/emails/project-invitation-email";
import { hashToken } from "@/lib/auth";

export const POST = withProject(
  async (req, ctx) => {
    const { email } = await req.json();
    if (typeof email !== "string" || email.length === 0) {
      return NextResponse.json({
        success: false,
        error: "email is required",
      } satisfies ApiResponse);
    }

    const [alreadyInvited] = await db
      .select({ expires: projectInvitationsTable.expires })
      .from(projectInvitationsTable)
      .where(
        and(
          eq(projectInvitationsTable.email, email),
          eq(projectInvitationsTable.projectId, ctx.projectId),
        ),
      );
    if (
      alreadyInvited &&
      new Date(alreadyInvited.expires) > new Date(Date.now())
    ) {
      return NextResponse.json({
        success: false,
        error: "User already invited",
      } satisfies ApiResponse);
    }

    const [userExist] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (userExist) {
      const [alreadyInThisProject] = await db
        .select({})
        .from(projectUsersTable)
        .where(
          and(
            eq(projectUsersTable.projectId, ctx.projectId),
            eq(projectUsersTable.userId, userExist.id),
          ),
        );
      if (alreadyInThisProject) {
        return NextResponse.json({
          success: false,
          error: "User already exists in this project",
        } satisfies ApiResponse);
      }
    }

    const expires = new Date(Date.now() + 86_400 * 14 * 1000); // 86_400 is 1 day in seconds
    const token = randomBytes(32).toString("hex");
    const params = new URLSearchParams({
      callbackUrl: `${process.env.NEXTAUTH_URL}/${ctx.params.projectSlug}`,
      token,
      email,
    });

    const url = `${
      process.env.NEXTAUTH_URL
    }/api/auth/callback/email?${params.toString()}`;

    try {
      const [invitation] = await db
        .insert(projectInvitationsTable)
        .values({
          email,
          projectId: ctx.projectId,
          expires,
        })
        .returning();

      await db.insert(verificationTokensTable).values({
        identifier: email,
        expires,
        token: hashToken(token),
      });

      if (process.env.NODE_ENV === "production") {
        await sendEmail({
          subject: `You've been invited to join a project on ${APP_NAME}`,
          email,
          react: ProjectInvitationEmail({
            url,
            email,
            inviterEmail: ctx.session.user.email!,
            inviterName: ctx.session.user.name || ctx.session.user.email!,
            projectName: ctx.projectName,
          }),
        });
      } else {
        console.log("Project Invitation Link: ", url);
      }

      return NextResponse.json({
        success: true,
        message: "Invitation email sent",
        data: invitation,
      } satisfies ApiResponse<ProjectInvitation>);
    } catch (error) {
      console.error(error);
      return NextResponse.json({
        success: false,
        error: "Failed to invite. Please try again",
      } satisfies ApiResponse);
    }
  },
  {
    requireRoles: ["owner", "admin"],
  },
);
