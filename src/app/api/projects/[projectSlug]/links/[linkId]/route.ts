import type { ApiResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { withLink } from "./utils";
import { linksTable } from "@/lib/schema/links";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import type { LinkModel } from "@/lib/types/db-types";

export const GET = withLink(async (req, ctx) => {
  return NextResponse.json({
    success: true,
    data: ctx.link,
  } satisfies ApiResponse<LinkModel>);
});

export const DELETE = withLink(async (req, ctx) => {
  try {
    const [link] = await db
      .delete(linksTable)
      .where(eq(linksTable.id, ctx.params.linkId))
      .returning();
    return NextResponse.json({
      success: true,
      data: link,
      message: "Link delete success",
    } satisfies ApiResponse<LinkModel>);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to delete link",
    } satisfies ApiResponse<LinkModel>);
  }
});
