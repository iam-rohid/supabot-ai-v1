import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parseReq } from "./utils";
import { getToken } from "next-auth/jwt";
import { AUTH_PATHNAMES, RESURVED_APP_PATH_KEYS } from "../constants";
import { psDB } from "../planetscale";

export async function appMiddleware(req: NextRequest, ev: NextFetchEvent) {
  const { pathname, pathKey } = parseReq(req);
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
  if (pathname === "/") {
    const query = `SELECT organizations.slug from organization_members
INNER JOIN organizations ON organizations.id = organization_members.organization_id
WHERE organization_members.user_id = ?`;
    const result = await psDB.execute(query, [sesson?.user?.id]);
    if (result.rows.length > 0) {
      const row = result.rows[0] as { slug: string };
      return NextResponse.redirect(new URL(`/${row.slug}`, req.url));
    }
    return NextResponse.redirect(new URL("/new-org", req.url));
  }

  if (!RESURVED_APP_PATH_KEYS.has(pathKey)) {
    const query = `SELECT organizations.slug from organization_members
INNER JOIN organizations ON organizations.id = organization_members.organization_id
WHERE organization_members.user_id = ? AND organizations.slug = ?`;
    const result = await psDB.execute(query, [sesson?.user?.id, pathKey]);
    if (result.size === 0) {
      return NextResponse.next();
    }
  }
  return NextResponse.rewrite(new URL(`/app${pathname}`, req.url));
}
