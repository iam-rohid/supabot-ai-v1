import { type BaseRequestHandler } from "@/app/api/utilts";
import type { ApiResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import {
  type WithProjectProps,
  type WithProjectHandlerProps,
  withProject,
  WithProjectContext,
} from "../../utils";
import { db } from "@/lib/db";
import { LinkModel, linksTable } from "@/lib/schema/links";
import { and, eq } from "drizzle-orm";

export type WithLinkContext = {
  params: { slug: string; linkId: string };
  link: LinkModel;
} & WithProjectContext;

export type WithLinkHandlerProps = {
  link: LinkModel;
} & WithProjectHandlerProps;
export type WithLinkProps = WithProjectProps & {};

export const withLink = <Ctx extends WithLinkContext>(
  handler: BaseRequestHandler<Ctx, WithLinkHandlerProps>,
  extraProps: WithLinkProps = {},
) =>
  withProject<Ctx>(async (req, ctx) => {
    const [link] = await db
      .select()
      .from(linksTable)
      .where(
        and(
          eq(linksTable.id, ctx.params.linkId),
          eq(linksTable.projectId, ctx.projectId),
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
