import "@/styles/globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import { APP_NAME, SYSTEM_THEME } from "@/lib/constants";
import { getSession } from "@/utils/session";

export const metadata: Metadata = {
  title: APP_NAME,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          let theme = localStorage.theme;
          if(!['dark','light'].includes(theme)) {
            theme = '${SYSTEM_THEME}';
          }
          const isPrefersColorSchemeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          const isDark = theme === 'dark' || (theme === '${SYSTEM_THEME}' && isPrefersColorSchemeDark);
          document.documentElement.classList.toggle('dark', isDark);
          `,
          }}
        ></script>
        {process.env.NODE_ENV === "production" && (
          <script
            defer
            src="https://unpkg.com/@tinybirdco/flock.js"
            data-host="https://api.us-east.tinybird.co"
            data-token={process.env.TINYBIRD_DATA_TOKEN}
          ></script>
        )}
      </head>
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
