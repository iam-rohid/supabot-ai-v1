import { NextRequest } from "next/server";

export const parseReq = (req: NextRequest) => {
  let domain = req.headers.get("host") as string;
  domain.replace("wwww.", "");
  const pathname = req.nextUrl.pathname;
  const pathKey = decodeURIComponent(pathname.split("/")[1]);
  const pathFullKey = decodeURIComponent(pathname.slice(1));
  return { domain, pathname, pathKey, pathFullKey };
};
