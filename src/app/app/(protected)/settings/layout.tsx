import TitleBar from "@/components/title-bar";
import { ReactNode } from "react";
import Sidebar from "@/components/sidebar";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <TitleBar title="Settings" />
      <div className="container flex items-start gap-8 py-8">
        <Sidebar
          items={[
            {
              href: "/settings",
              label: "Settings",
              exactMatch: true,
            },
          ]}
        />
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}
