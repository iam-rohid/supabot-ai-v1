import TitleBar from "@/components/title-bar";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import ChatbotsList from "./chatbots-list";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Chatbots | ${APP_NAME}`,
};

export default function AppPage({
  params: { organization },
}: {
  params: { organization: string };
}) {
  return (
    <>
      <TitleBar title="Chatbots">
        <Button asChild>
          <Link href={`/new?org=${organization}`}>
            <PlusIcon size={20} className="-ml-1 mr-2" />
            New Chatbot
          </Link>
        </Button>
      </TitleBar>
      <Suspense fallback={<p>Loading...</p>}>
        <ChatbotsList organization={organization} />
      </Suspense>
    </>
  );
}
