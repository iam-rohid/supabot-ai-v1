import { NextFetchEvent, NextRequest } from "next/server";
import { parseReq } from "./lib/middleware/utils";
import {
  ADMIN_HOSTNAMES,
  APP_HOSTNAMES,
  HOME_HOSTNAMES,
} from "./lib/constants";
import { appMiddleware } from "./lib/middleware/app";
import { adminMiddleware } from "./lib/middleware/admin";
import { rootMiddleware } from "./lib/middleware/root";

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
  const { domain } = parseReq(req);

  if (APP_HOSTNAMES.has(domain)) {
    return appMiddleware(req, ev);
  }
  if (ADMIN_HOSTNAMES.has(domain)) {
    return adminMiddleware(req, ev);
  }
  if (HOME_HOSTNAMES.has(domain)) {
    return rootMiddleware(req, ev);
  }
}
