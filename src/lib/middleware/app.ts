import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parseReq } from "./utils";

export function appMiddleware(req: NextRequest, ev: NextFetchEvent) {
  const { pathname } = parseReq(req);
  return NextResponse.rewrite(
    new URL(`/app${pathname === "/" ? "" : pathname}`, req.url)
  );
}
