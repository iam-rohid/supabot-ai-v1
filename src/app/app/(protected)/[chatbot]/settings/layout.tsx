import Sidebar from "@/components/sidebar";
import TitleBar from "@/components/title-bar";
import type { ReactNode } from "react";

export default function ChatbotSettingsPage({
  children,
  params: { chatbot },
}: {
  children: ReactNode;
  params: { chatbot: string };
}) {
  return (
    <main>
      <TitleBar title="Settings" />
      <div className="container flex items-start gap-8 py-8">
        <Sidebar
          items={[
            {
              href: `/${chatbot}/settings`,
              label: "Settings",
              exactMatch: true,
            },
            {
              href: `/${chatbot}/settings/billing`,
              label: "Billing",
            },
            {
              href: `/${chatbot}/settings/people`,
              label: "People",
            },
          ]}
        />
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}
