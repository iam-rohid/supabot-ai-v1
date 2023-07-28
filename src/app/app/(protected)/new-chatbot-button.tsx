"use client";

import { useChatbots } from "@/components/chatbots-provider";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function NewChatbotButton({
  label = "New Chatbot",
}: {
  label?: string;
}) {
  const { createChatbot } = useChatbots();
  return (
    <Button onClick={createChatbot}>
      <PlusIcon size={20} className="-ml-1 mr-2" />
      {label}
    </Button>
  );
}
