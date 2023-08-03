import PageHeader from "@/components/page-header";
import type { ReactNode } from "react";
import Sidebar from "@/components/sidebar";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <PageHeader title="Settings" />
      <div className="container flex items-start gap-8 py-8">
        <Sidebar
          items={[
            {
              href: "/dashboard/settings",
              label: "General",
              exactMatch: true,
            },
          ]}
        />
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}
