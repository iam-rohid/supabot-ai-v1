import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import GetSitemapLinks from "get-sitemap-links";
import { withAuth } from "../utilts";

export const POST = withAuth(async (req: NextRequest) => {
  const { url } = await req.json();
  if (!url) {
    throw "url is required";
  }

  const validatedUrl = z.string().url().parse(url);

  const links = await GetSitemapLinks(validatedUrl);
  return NextResponse.json(links);
});
