import Sidebar from "@/components/sidebar";
import PageHeader from "@/components/page-header";
import type { ReactNode } from "react";

export default function ProjectSettingsPage({
  children,
  params: { projectSlug },
}: {
  children: ReactNode;
  params: { projectSlug: string };
}) {
  return (
    <main>
      <PageHeader title="Settings" />
      <div className="container flex items-start gap-8 py-8">
        <Sidebar
          items={[
            {
              href: `/dashboard/${projectSlug}/settings`,
              label: "General",
              exactMatch: true,
            },
            {
              href: `/dashboard/${projectSlug}/settings/billing`,
              label: "Billing",
            },
            {
              href: `/dashboard/${projectSlug}/settings/people`,
              label: "People",
            },
          ]}
        />
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}
