import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parseReq } from "./utils";
import { getToken } from "next-auth/jwt";
import { AUTH_PATHNAMES } from "../constants";

export async function appMiddleware(req: NextRequest, ev: NextFetchEvent) {
  const { pathname } = parseReq(req);
  const sesson = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!sesson?.email && !AUTH_PATHNAMES.has(pathname)) {
    const params = new URLSearchParams();
    if (pathname !== "/") {
      params.set("next", pathname);
    }
    return NextResponse.redirect(
      new URL(`/login?${params.toString()}`, req.url)
    );
  } else if (sesson?.email && AUTH_PATHNAMES.has(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.rewrite(
    new URL(`/app${pathname === "/" ? "" : pathname}`, req.url)
  );
}
