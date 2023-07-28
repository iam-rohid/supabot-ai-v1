import { withAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export const PUT = withAuth(async (req, { session }) => {
  try {
    const { name, email, image } = await req.json();
    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        ...(typeof name === "string" && name.length > 0 ? { name } : {}),
        ...(typeof email === "string" && email.length > 0 ? { email } : {}),
        ...(typeof image === "string" && image.length > 0 ? { image } : {}),
      },
    });
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

export const DELETE = withAuth(async (_, { session }) => {
  const ownerOfChatbots = await prisma.chatbotUser.findMany({
    where: { userId: session.user.id, role: "OWNER" },
  });

  if (ownerOfChatbots.length > 0) {
    return NextResponse.json({
      success: false,
      error:
        "You must transfer ownership of your chatbots or delete them before you can delete your account.",
    } satisfies ApiResponse);
  }

  try {
    const user = await prisma.user.delete({
      where: {
        id: session.user.id,
      },
    });
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
