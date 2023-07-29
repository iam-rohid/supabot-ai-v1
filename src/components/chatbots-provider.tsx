"use client";

import { useQuery } from "@tanstack/react-query";
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ApiResponse } from "@/lib/types";
import type { Chatbot } from "@prisma/client";

export type ChatbotsContextType = {
  chatbots: Chatbot[];
  currentChatbot?: Chatbot | null;
  isLoading?: boolean;
  setCurrentChatbotSlug: (slug: string | null) => void;
};

export const ChatbotsContext = createContext<ChatbotsContextType | null>(null);

const fetchChatbotsFn = async () => {
  const res = await fetch("/api/chatbots");
  const body: ApiResponse<Chatbot[]> = await res.json();
  if (!body.success) {
    throw body.error;
  }
  return body.data;
};

export default function ChatbotsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentChatbotSlug, setCurrentChatbotSlug] = useState<string | null>(
    null,
  );
  const chatbotsQuery = useQuery({
    queryKey: ["chatbots"],
    queryFn: fetchChatbotsFn,
  });

  const chatbots = useMemo(
    () => (chatbotsQuery.isSuccess ? chatbotsQuery.data : []),
    [chatbotsQuery.data, chatbotsQuery.isSuccess],
  );

  const currentChatbot = useMemo(
    () =>
      currentChatbotSlug
        ? chatbots.find((chatbot) => chatbot.slug === currentChatbotSlug)
        : null,
    [chatbots, currentChatbotSlug],
  );

  return (
    <ChatbotsContext.Provider
      value={{
        chatbots,
        isLoading: chatbotsQuery.isLoading,
        setCurrentChatbotSlug,
        currentChatbot,
      }}
    >
      {children}
    </ChatbotsContext.Provider>
  );
}

export const useChatbots = () => {
  const context = useContext(ChatbotsContext);
  if (!context) {
    throw "useChatbots must use inside a ChatbotProvider";
  }
  return context;
};
