import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { JWT, getToken } from "next-auth/jwt";
import { sql } from "./lib/db";

export const getTokenFromReq = (req: NextRequest) =>
  getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

export const config = {
  matcher: [
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

interface MiddlewareHandler<Ctx = Record<string, any>> {
  (req: NextRequest, ev: NextFetchEvent, ctx: Ctx): any;
}

const protectProject: MiddlewareHandler<{ token: JWT; slug: string }> = async (
  req,
  ev,
  ctx,
) => {
  const [project] = await sql(
    `SELECT projects.id FROM projects 
    WHERE projects.slug = $1`,
    [ctx.slug],
  );

  if (!project) {
    return NextResponse.rewrite(
      new URL("/dashboard/project-not-found", req.url),
    );
  }

  const [projectUser] = await sql(
    `SELECT EXISTS(
      SELECT 1 FROM project_users 
      WHERE project_users.project_id = $1 AND project_users.user_id = $2
    )`,
    [project.id, ctx.token.sub],
  );
  console.log({ projectUser });

  if (!projectUser.exists) {
    const [invitedUser] = await sql(
      `SELECT EXISTS(
        SELECT 1 FROM project_invitations 
        WHERE project_invitations.project_id = $1 AND project_invitations.email = $2
      )`,
      [project.id, ctx.token.email],
    );
    if (!invitedUser.exists) {
      return NextResponse.rewrite(
        new URL("/dashboard/project-not-found", req.url),
      );
    }
  }

  return NextResponse.next();
};

const protectDashboard: MiddlewareHandler = async (req, ev, ctx) => {
  const token = await getTokenFromReq(req);

  if (!(token && token.sub && token.email)) {
    const params = new URLSearchParams({ next: req.nextUrl.href });
    return NextResponse.redirect(
      new URL(`/signin?${params.toString()}`, req.url),
    );
  }

  /*
  if pathanme is "/dashboard/my-bot"
  then key would be "my-bot"
  */
  const key = req.nextUrl.pathname.split("/")[2];
  const presurvedKeys = new Set(["settings", "project-not-found"]);

  if (key && !presurvedKeys.has(key)) {
    return protectProject(req, ev, { ...ctx, token, slug: key });
  }
  return NextResponse.next();
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    return protectDashboard(req, ev, {});
  }

  return NextResponse.next();
}
