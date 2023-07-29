import { type BaseRequestHandler } from "@/app/api/utilts";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/lib/types";
import type { Page } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  type WithChatProps,
  type WithChatbotHandlerProps,
  withChatbot,
} from "../../utils";

export type WithPageContext = { params: { slug: string; pageId: string } };
export type WithPageHandlerProps = {
  page: Page;
} & WithChatbotHandlerProps;
export type WithPageProps = WithChatProps & {};

export const withPage = <Ctx extends WithPageContext>(
  handler: BaseRequestHandler<Ctx, WithPageHandlerProps>,
  extraProps: WithPageProps = {},
) =>
  withChatbot<Ctx>(async (req, ctx, props) => {
    const page = await prisma.page.findUnique({
      where: { id: ctx.params.pageId, chatbotId: props.chatbot.id },
    });
    if (!page) {
      return NextResponse.json({
        success: false,
        error: "Page not found!",
      } satisfies ApiResponse);
    }
    return handler(req, ctx, { ...props, page });
  }, extraProps);
