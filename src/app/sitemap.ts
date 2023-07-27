import { DOMAIN } from "@/lib/constants";
import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default function sitemap(): MetadataRoute.Sitemap {
  const headersList = headers();
  let domain = headersList.get("host") as string;

  return [
    {
      url: `https:${domain}`,
      lastModified: new Date(),
    },
    ...(domain === DOMAIN
      ? [
          {
            url: `https:${domain}/pricing`,
            lastModified: new Date(),
          },
        ]
      : []),
  ];
}
