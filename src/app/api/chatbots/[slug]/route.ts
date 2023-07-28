import { withChatbot } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { Chatbot } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = withChatbot(async (_, { chatbot }) => {
  return NextResponse.json({
    success: true,
    data: chatbot,
  } satisfies ApiResponse<Chatbot>);
});

export const PUT = withChatbot(
  async (req, { chatbot }) => {
    const { name, slug, description } = await req.json();
    try {
      const updatedChatbot = await prisma.chatbot.update({
        where: {
          id: chatbot.id,
        },
        data: {
          ...(typeof name === "string" && name.length > 0 ? { name } : {}),
          ...(typeof slug === "string" && slug.length > 0 ? { slug } : {}),
          ...(typeof description === "string" && description.length > 0
            ? { description }
            : {}),
        },
      });
      return NextResponse.json({
        success: true,
        message: "Chatbot updated!",
        data: updatedChatbot,
      } satisfies ApiResponse<Chatbot>);
    } catch (error: any) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            error: "Chatbot slug already exists.",
          } satisfies ApiResponse,
          { status: 422 },
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update chatbot",
        } satisfies ApiResponse,
        { status: 400 },
      );
    }
  },
  { requireRoles: ["OWNER", "ADMIN"] },
);

export const DELETE = withChatbot(
  async (_, { chatbot }) => {
    try {
      const deletedChatbot = await prisma.chatbot.delete({
        where: {
          id: chatbot.id,
        },
      });
      return NextResponse.json({
        success: true,
        message: "Chatbot deleted!",
        data: deletedChatbot,
      } satisfies ApiResponse<Chatbot>);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete chatbot",
        } satisfies ApiResponse,
        { status: 400 },
      );
    }
  },
  { requireRoles: ["OWNER"] },
);
