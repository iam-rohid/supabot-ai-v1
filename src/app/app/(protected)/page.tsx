import TitleBar from "@/components/title-bar";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import ChatbotsList from "./chatbots-list";
import { Suspense } from "react";
import NewChatbotButton from "./new-chatbot-button";

export const metadata: Metadata = {
  title: `Chatbots | ${APP_NAME}`,
};

export default function AppPage() {
  return (
    <>
      <TitleBar title="Overview">
        <NewChatbotButton />
      </TitleBar>
      <Suspense>
        <ChatbotsList />
      </Suspense>
    </>
  );
}
