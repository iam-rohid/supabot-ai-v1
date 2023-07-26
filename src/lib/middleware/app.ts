import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parseReq } from "./utils";
import { getToken } from "next-auth/jwt";
import { AUTH_PATHNAMES } from "../constants";
import { psDB } from "../planetscale";

const query = `SELECT organizations.slug from organization_members
INNER JOIN organizations ON organizations.id = organization_members.organization_id
WHERE user_id = ?`;

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
  if (pathname === "/") {
    // const something = await prisma.organization.findFirst({
    //   where: {
    //     members: {
    //       some: {
    //         userId: sesson?.sub,
    //       },
    //     },
    //   },
    // });
    const something = await psDB.execute(query, [sesson?.user?.id]);
    console.log(something);
    if (something.rows.length > 0) {
      const row = something.rows[0] as { slug: string };
      return NextResponse.redirect(new URL(`/${row.slug}`, req.url));
    }
    return NextResponse.redirect(new URL("/new-org", req.url));
  }
  return NextResponse.rewrite(new URL(`/app${pathname}`, req.url));
}
