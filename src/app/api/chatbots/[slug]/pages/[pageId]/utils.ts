import { type BaseRequestHandler } from "@/app/api/utilts";
import type { ApiResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import {
  type WithChatProps,
  type WithChatbotHandlerProps,
  withChatbot,
  WithChatbotContext,
} from "../../utils";
import { db } from "@/lib/drizzle";
import { Page, pagesTable } from "@/lib/schema/pages";
import { and, eq } from "drizzle-orm";

export type WithPageContext = {
  params: { slug: string; pageId: string };
  page: Page;
} & WithChatbotContext;

export type WithPageHandlerProps = {
  page: Page;
} & WithChatbotHandlerProps;
export type WithPageProps = WithChatProps & {};

export const withPage = <Ctx extends WithPageContext>(
  handler: BaseRequestHandler<Ctx, WithPageHandlerProps>,
  extraProps: WithPageProps = {},
) =>
  withChatbot<Ctx>(async (req, ctx) => {
    const [page] = await db
      .select()
      .from(pagesTable)
      .where(
        and(
          eq(pagesTable.id, ctx.params.pageId),
          eq(pagesTable.chatbotId, ctx.chatbot.id),
        ),
      );
    if (!page) {
      return NextResponse.json({
        success: false,
        error: "Page not found!",
      } satisfies ApiResponse);
    }
    ctx.page = page;
    return handler(req, ctx);
  }, extraProps);
