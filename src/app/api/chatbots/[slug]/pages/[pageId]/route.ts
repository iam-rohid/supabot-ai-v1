import type { ApiResponse } from "@/lib/types";
import type { Page } from "@prisma/client";
import { NextResponse } from "next/server";
import { withPage } from "./utils";

export const GET = withPage(async (req, ctx, props) => {
  return NextResponse.json({
    success: true,
    data: props.page,
  } satisfies ApiResponse<Page>);
});
