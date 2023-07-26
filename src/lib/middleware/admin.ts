import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parseReq } from "./utils";

export function adminMiddleware(req: NextRequest, ev: NextFetchEvent) {
  const { pathname } = parseReq(req);
  return NextResponse.rewrite(
    new URL(`/admin${pathname === "/" ? "" : pathname}`, req.url)
  );
}
