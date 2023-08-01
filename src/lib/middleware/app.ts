import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parseReq } from "./utils";
import { getToken } from "next-auth/jwt";
import { AUTH_PATHNAMES, RESURVED_APP_PATH_KEYS } from "../constants";
import { db } from "../drizzle";
import { chatbotsTable } from "../schema/chatbots";
import { and, eq } from "drizzle-orm";
import { chatbotUsersTable } from "../schema/chatbot-users";

export async function appMiddleware(req: NextRequest, ev: NextFetchEvent) {
  const { pathname, pathKey, searchParams } = parseReq(req);

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!session?.email && !AUTH_PATHNAMES.has(pathname)) {
    const params = new URLSearchParams();
    if (pathname !== "/") {
      params.set("next", pathname);
    }
    return NextResponse.redirect(
      new URL(`/signin?${params.toString()}`, req.url),
    );
  } else if (session?.email && AUTH_PATHNAMES.has(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathKey && !RESURVED_APP_PATH_KEYS.has(pathKey)) {
    const data = await db
      .select({})
      .from(chatbotUsersTable)
      .leftJoin(
        chatbotsTable,
        eq(chatbotsTable.id, chatbotUsersTable.chatbotId),
      )
      .where(
        and(
          eq(chatbotUsersTable.userId, session!.user!.id),
          eq(chatbotsTable.slug, pathKey),
        ),
      );
    if (!data.length) {
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
