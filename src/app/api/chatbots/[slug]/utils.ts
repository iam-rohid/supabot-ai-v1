import { ApiResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import {
  type WithAuthHandlerProps,
  type WithAuthProps,
  type BaseRequestHandler,
  withAuth,
  WithAuthContext,
} from "../../utilts";
import { Chatbot, chatbotsTable } from "@/lib/schema/chatbots";
import { ChatbotUser, chatbotUsersTable } from "@/lib/schema/chatbot-users";
import { db } from "@/lib/drizzle";
import { and, eq } from "drizzle-orm";

export type WithChatbotContext = {
  params: {
    slug: string;
  };
  chatbot: Chatbot;
} & WithAuthContext;

export type WithChatbotHandlerProps = WithAuthHandlerProps & {};
export type WithChatProps = WithAuthProps & {
  requireRoles?: ChatbotUser["role"][];
};

export const withChatbot = <C extends WithChatbotContext>(
  handler: BaseRequestHandler<C, WithChatbotHandlerProps>,
  extraProps: WithChatProps = {},
) =>
  withAuth<C>(async (req, ctx) => {
    const [chatbot] = await db
      .select({
        id: chatbotsTable.id,
        createdAt: chatbotsTable.createdAt,
        updatedAt: chatbotsTable.updatedAt,
        name: chatbotsTable.name,
        slug: chatbotsTable.slug,
        description: chatbotsTable.description,
        role: chatbotUsersTable.role,
      })
      .from(chatbotsTable)
      .innerJoin(
        chatbotUsersTable,
        eq(chatbotUsersTable.chatbotId, chatbotsTable.id),
      )
      .where(
        and(
          eq(chatbotsTable.slug, ctx.params.slug),
          eq(chatbotUsersTable.userId, ctx.session.user.id),
        ),
      );

    if (!chatbot) {
      return NextResponse.json({
        success: false,
        error: "Chatbot not found!",
      } satisfies ApiResponse);
    }

    if (
      extraProps.requireRoles &&
      extraProps.requireRoles.length > 0 &&
      !new Set(extraProps.requireRoles).has(chatbot.role)
    ) {
      return NextResponse.json({
        success: false,
        error: "You don't have access!",
      } satisfies ApiResponse);
    }

    ctx.chatbot = chatbot;

    return handler(req, ctx);
  });
