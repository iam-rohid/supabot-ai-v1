import "@/styles/globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import { SYSTEM_THEME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "SiteChat AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
