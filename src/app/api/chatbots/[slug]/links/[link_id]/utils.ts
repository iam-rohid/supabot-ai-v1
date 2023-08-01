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
import { LinkModel, linksTable } from "@/lib/schema/links";
import { and, eq } from "drizzle-orm";

export type WithLinkContext = {
  params: { slug: string; link_id: string };
  link: LinkModel;
} & WithChatbotContext;

export type WithLinkHandlerProps = {
  link: LinkModel;
} & WithChatbotHandlerProps;
export type WithLinkProps = WithChatProps & {};

export const withLink = <Ctx extends WithLinkContext>(
  handler: BaseRequestHandler<Ctx, WithLinkHandlerProps>,
  extraProps: WithLinkProps = {},
) =>
  withChatbot<Ctx>(async (req, ctx) => {
    const [link] = await db
      .select()
      .from(linksTable)
      .where(
        and(
          eq(linksTable.id, ctx.params.link_id),
          eq(linksTable.chatbotId, ctx.chatbot.id),
        ),
      );
    if (!link) {
      return NextResponse.json({
        success: false,
        error: "Link not found!",
      } satisfies ApiResponse);
    }
    ctx.link = link;
    return handler(req, ctx);
  }, extraProps);
