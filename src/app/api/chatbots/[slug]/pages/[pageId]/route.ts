import type { ApiResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { withPage } from "./utils";
import { Page } from "@/lib/schema/pages";

export const GET = withPage(async (req, ctx) => {
  return NextResponse.json({
    success: true,
    data: ctx.page,
  } satisfies ApiResponse<Page>);
});
