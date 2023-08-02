import "@/styles/globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import { APP_NAME, SYSTEM_THEME } from "@/lib/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: APP_NAME,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
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
      </head>
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
