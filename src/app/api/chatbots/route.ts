import type { ApiResponse } from "@/lib/types";
import {
  CreateChatbotSchemaData,
  createChatbotSchema,
} from "@/lib/validations";
import { NextResponse } from "next/server";
import { withAuth } from "../utilts";
import { Chatbot, chatbotsTable } from "@/lib/schema/chatbots";
import { db } from "@/lib/drizzle";
import { chatbotUsersTable } from "@/lib/schema/chatbot-users";
import { eq } from "drizzle-orm";

export const GET = withAuth(async (req, ctx) => {
  try {
    const chatbots = await db
      .select({
        id: chatbotsTable.id,
        createdAt: chatbotsTable.createdAt,
        updatedAt: chatbotsTable.updatedAt,
        name: chatbotsTable.name,
        slug: chatbotsTable.slug,
        description: chatbotsTable.description,
      })
      .from(chatbotUsersTable)
      .innerJoin(
        chatbotsTable,
        eq(chatbotsTable.id, chatbotUsersTable.chatbotId),
      )
      .where(eq(chatbotUsersTable.userId, ctx.session.user.id));

    return NextResponse.json({
      success: true,
      data: chatbots,
    } satisfies ApiResponse<Chatbot[]>);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to load chatbots",
    } satisfies ApiResponse<Chatbot[]>);
  }
});

export const POST = withAuth(async (req, ctx) => {
  const body = await req.json();

  let data: CreateChatbotSchemaData;
  try {
    data = await createChatbotSchema.parseAsync(body);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid credentials",
      } satisfies ApiResponse,
      { status: 400 },
    );
  }

  try {
    const [chatbot] = await db.insert(chatbotsTable).values(data).returning();
    await db.insert(chatbotUsersTable).values({
      chatbotId: chatbot.id,
      userId: ctx.session.user.id,
      role: "owner",
    });

    return NextResponse.json({
      success: true,
      message: "Chatbot created",
      data: chatbot,
    } satisfies ApiResponse<Chatbot>);
  } catch (error: any) {
    console.error("Failed to create chatbot: ", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Chatbot slug is already in use.",
        } satisfies ApiResponse,
        { status: 422 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create chatbot",
      } satisfies ApiResponse,
      { status: 400 },
    );
  }
});
