import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { Chatbot, ChatbotUserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  type WithAuthHandlerProps,
  type WithAuthProps,
  type BaseRequestHandler,
  withAuth,
} from "../../utilts";

export type WithChatbotContext = {
  params: {
    slug: string;
  };
};
export type WithChatbotHandlerProps = WithAuthHandlerProps & {
  chatbot: Chatbot;
  role: ChatbotUserRole;
};
export type WithChatProps = WithAuthProps & {
  requireRoles?: ChatbotUserRole[];
};

export const withChatbot = <C extends WithChatbotContext>(
  handler: BaseRequestHandler<C, WithChatbotHandlerProps>,
  extraProps: WithChatProps = {},
) =>
  withAuth<C>(async (req, ctx, props) => {
    const chatbot = await prisma.chatbot.findUnique({
      where: {
        slug: ctx.params.slug,
      },
      select: {
        id: true,
        createdAt: true,
        name: true,
        description: true,
        slug: true,
        updatedAt: true,
        users: {
          where: {
            userId: props.session.user.id,
          },
          select: {
            role: true,
          },
        },
      },
    });

    if (!chatbot || chatbot.users.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Chatbot not found!",
      } satisfies ApiResponse);
    }

    if (
      extraProps.requireRoles &&
      extraProps.requireRoles.length > 0 &&
      !new Set(extraProps.requireRoles).has(chatbot.users[0].role)
    ) {
      return NextResponse.json({
        success: false,
        error: "You don't have access!",
      } satisfies ApiResponse);
    }

    return handler(req, ctx, {
      ...props,
      chatbot,
      role: chatbot.users[0].role,
    });
  });
