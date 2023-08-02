import type { ApiResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { withAuth } from "../utilts";
import { db } from "@/lib/drizzle";
import { type User, usersTable } from "@/lib/schema/users";
import { and, eq } from "drizzle-orm";
import { projectUsersTable } from "@/lib/schema/chatbot-users";

export const PUT = withAuth(async (req, ctx) => {
  try {
    const { name, email, image } = await req.json();
    const [user] = await db
      .update(usersTable)
      .set({
        ...(typeof name === "string" && name.length > 0 ? { name } : {}),
        ...(typeof email === "string" && email.length > 0 ? { email } : {}),
        ...(typeof image === "string" && image.length > 0 ? { image } : {}),
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, ctx.session.user.id))
      .returning();
    return NextResponse.json({
      success: true,
      message: "User update success",
      data: user,
    } satisfies ApiResponse<User>);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Email is already in use.",
        } satisfies ApiResponse<User>,
        { status: 422 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Faield to update user",
      } satisfies ApiResponse<User>,
      { status: 400 },
    );
  }
});

export const DELETE = withAuth(async (req, ctx) => {
  const ownerOfProjects = await db
    .select()
    .from(projectUsersTable)
    .where(
      and(
        eq(projectUsersTable.userId, ctx.session.user.id),
        eq(projectUsersTable.role, "owner"),
      ),
    );

  if (ownerOfProjects.length) {
    return NextResponse.json({
      success: false,
      error:
        "You must transfer ownership of your projects or delete them before you can delete your account.",
    } satisfies ApiResponse);
  }

  try {
    const [user] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, ctx.session.user.id))
      .returning();
    return NextResponse.json({
      success: true,
      message: "User has been deleted",
      data: user,
    } satisfies ApiResponse<User>);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to delete user",
    } satisfies ApiResponse);
  }
});
