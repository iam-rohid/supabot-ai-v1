"use client";

import { useChatbots } from "@/components/chatbots-provider";
import { ReactNode, useEffect } from "react";

export default function ChatbotLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { chatbot: string };
}) {
  const { setCurrentChatbotSlug } = useChatbots();

  useEffect(() => {
    setCurrentChatbotSlug(params.chatbot);
    return () => {
      setCurrentChatbotSlug(null);
    };
  }, [params.chatbot, setCurrentChatbotSlug]);

  return <>{children}</>;
}
