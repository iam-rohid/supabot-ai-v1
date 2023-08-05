import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "./lib/drizzle";
import { projectUsersTable } from "./lib/schema/project-users";
import { and, eq } from "drizzle-orm";
import { projectsTable } from "./lib/schema/projects";
import { projectInvitationsTable } from "./lib/schema/project-invitations";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!(token?.sub && token.email)) {
      const params = new URLSearchParams({ next: req.nextUrl.href });
      return NextResponse.redirect(
        new URL(`/signin?${params.toString()}`, req.url),
      );
    }

    const key = req.nextUrl.pathname.split("/")[2];
    const presurvedKeys = new Set(["settings", "project-not-found"]);
    if (key && !presurvedKeys.has(key)) {
      const [project] = await db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(eq(projectsTable.slug, key));
      if (!project) {
        return NextResponse.rewrite(
          new URL("/dashboard/project-not-found", req.url),
        );
      }

      const [projectUser] = await db
        .select({})
        .from(projectUsersTable)
        .where(
          and(
            eq(projectUsersTable.projectId, project.id),
            eq(projectUsersTable.userId, token.sub),
          ),
        );

      const [invited] = await db
        .select({})
        .from(projectInvitationsTable)
        .where(
          and(
            eq(projectInvitationsTable.projectId, project.id),
            eq(projectInvitationsTable.email, token.email),
          ),
        );

      if (!projectUser && !invited) {
        return NextResponse.rewrite(
          new URL("/dashboard/project-not-found", req.url),
        );
      }
    }
  }
}
