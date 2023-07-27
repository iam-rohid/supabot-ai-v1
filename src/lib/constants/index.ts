export const APP_NAME = "SiteChat AI";

export const BASE_LOCALHOST = "localhost:3000";
export const BASE_DOMAIN = "sitechat-ai.com";

export const HOME_HOSTNAMES = new Set([BASE_LOCALHOST, BASE_DOMAIN]);
export const HOME_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://${BASE_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : `http://${BASE_LOCALHOST}`;

export const APP_HOSTNAMES = new Set([
  `app.${BASE_LOCALHOST}`,
  `app.${BASE_DOMAIN}`,
  `preview.${BASE_DOMAIN}`,
]);
export const APP_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://app.${BASE_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? `https://preview.${BASE_DOMAIN}`
    : `http://app.${BASE_LOCALHOST}`;
export const RESURVED_APP_PATH_KEYS = new Set([
  "signin",
  "new-org",
  "settings",
  "new",
]);

export const ADMIN_HOSTNAMES = new Set([
  `admin.${BASE_LOCALHOST}`,
  `admin.${BASE_DOMAIN}`,
]);

export const AUTH_PATHNAMES = new Set(["/signin"]);
