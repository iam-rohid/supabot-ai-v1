import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parseReq } from "./utils";
import { getToken } from "next-auth/jwt";
import { AUTH_PATHNAMES, RESURVED_APP_PATH_KEYS } from "../constants";
import { neonDb } from "../neon";

export async function appMiddleware(req: NextRequest, ev: NextFetchEvent) {
  const { pathname, pathKey, searchParams } = parseReq(req);

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
      new URL(`/signin?${params.toString()}`, req.url),
    );
  } else if (sesson?.email && AUTH_PATHNAMES.has(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathKey && !RESURVED_APP_PATH_KEYS.has(pathKey)) {
    const query = `
    SELECT chatbots.slug from chatbot_users 
    INNER JOIN chatbots ON chatbots.id = chatbot_users.chatbot_id 
    WHERE chatbot_users.user_id = $1 AND chatbots.slug = $2;
    `;
    const rows = await neonDb(query, [sesson?.user?.id, pathKey]);
    console.log(JSON.stringify(rows, null, 2));
    if (!rows.length) {
      return NextResponse.next();
    }
  }

  return NextResponse.rewrite(
    new URL(
      `/app${pathname === "/" ? "" : pathname}?${searchParams.toString()}`,
      req.url,
    ),
  );
}
