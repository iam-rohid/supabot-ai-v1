import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parseReq } from "./utils";

export function rootMiddleware(req: NextRequest, ev: NextFetchEvent) {
  const { pathname } = parseReq(req);
  return NextResponse.rewrite(
    new URL(`/home${pathname === "/" ? "" : pathname}`, req.url),
  );
}
