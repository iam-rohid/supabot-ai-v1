import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "./lib/drizzle";
import { projectUsersTable } from "./lib/schema/project-users";
import { and, eq } from "drizzle-orm";
import { projectsTable } from "./lib/schema/projects";

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
    const userId = token?.sub;
    if (!userId) {
      const params = new URLSearchParams({ next: req.nextUrl.href });
      return NextResponse.redirect(
        new URL(`/signin?${params.toString()}`, req.url),
      );
    }

    const key = req.nextUrl.pathname.split("/")[2];
    const presurvedKeys = new Set(["settings", "not-found"]);
    if (key && !presurvedKeys.has(key)) {
      const projects = await db
        .select({})
        .from(projectUsersTable)
        .innerJoin(
          projectsTable,
          eq(projectsTable.id, projectUsersTable.projectId),
        )
        .where(
          and(
            eq(projectUsersTable.userId, userId),
            eq(projectsTable.slug, key),
          ),
        );
      console.log({ key, projects });
      if (!projects.length) {
        return NextResponse.rewrite(
          new URL("/dashboard/project-not-found", req.url),
        );
      }
    }
  }
}
