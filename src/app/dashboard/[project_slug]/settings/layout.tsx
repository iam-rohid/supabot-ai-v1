import Sidebar from "@/components/sidebar";
import PageHeader from "@/components/page-header";
import type { ReactNode } from "react";

export default function ProjectSettingsPage({
  children,
  params: { project_slug },
}: {
  children: ReactNode;
  params: { project_slug: string };
}) {
  return (
    <main>
      <PageHeader title="Settings" />
      <div className="container flex items-start gap-8 py-8">
        <Sidebar
          items={[
            {
              href: `/dashboard/${project_slug}/settings`,
              label: "General",
              exactMatch: true,
            },
            {
              href: `/dashboard/${project_slug}/settings/billing`,
              label: "Billing",
            },
            {
              href: `/dashboard/${project_slug}/settings/people`,
              label: "People",
            },
          ]}
        />
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}
