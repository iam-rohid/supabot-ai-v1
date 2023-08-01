import type { ApiResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { withChatbot } from "./utils";
import { Chatbot, chatbotsTable } from "@/lib/schema/chatbots";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";

export const GET = withChatbot(async (req, ctx) => {
  return NextResponse.json({
    success: true,
    data: ctx.chatbot,
  } satisfies ApiResponse<Chatbot>);
});

export const PUT = withChatbot(
  async (req, ctx) => {
    const { name, slug, description } = await req.json();
    try {
      const [chatbot] = await db
        .update(chatbotsTable)
        .set({
          ...(typeof name === "string" ? { name } : {}),
          ...(typeof slug === "string" ? { slug } : {}),
          ...(typeof description === "string" ? { description } : {}),
          updatedAt: new Date(),
        })
        .where(eq(chatbotsTable.slug, ctx.params.slug))
        .returning();
      return NextResponse.json({
        success: true,
        message: "Chatbot updated!",
        data: chatbot,
      } satisfies ApiResponse<Chatbot>);
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update chatbot",
        } satisfies ApiResponse,
        { status: 400 },
      );
    }
  },
  { requireRoles: ["owner", "admin"] },
);

export const DELETE = withChatbot(
  async (req, ctx) => {
    try {
      const [chatbot] = await db
        .delete(chatbotsTable)
        .where(eq(chatbotsTable.slug, ctx.params.slug))
        .returning();
      return NextResponse.json({
        success: true,
        message: "Chatbot deleted!",
        data: chatbot,
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
  { requireRoles: ["owner"] },
);
