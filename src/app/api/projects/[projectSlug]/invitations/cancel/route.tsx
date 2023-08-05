import { NextResponse } from "next/server";
import { withProject } from "../../utils";
import type { ApiResponse } from "@/lib/types";
import { db } from "@/lib/db";
import { projectInvitationsTable } from "@/lib/schema/project-invitations";
import { and, eq } from "drizzle-orm";
import type { ProjectInvitation } from "@/lib/types/db-types";

export const POST = withProject(async (req, ctx) => {
  if (!ctx.invitation) {
    return NextResponse.json({
      success: false,
      error: "Invitation not found!",
    } satisfies ApiResponse);
  }
  try {
    const [invitation] = await db
      .delete(projectInvitationsTable)
      .where(
        and(
          eq(projectInvitationsTable.email, ctx.session.user.email!),
          eq(projectInvitationsTable.projectId, ctx.projectId),
        ),
      )
      .returning();
    return NextResponse.json({
      success: true,
      message: "Invitation cancel success",
      data: invitation,
    } satisfies ApiResponse<ProjectInvitation>);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error: "Failed to cancel invitation!",
    } satisfies ApiResponse);
  }
});
