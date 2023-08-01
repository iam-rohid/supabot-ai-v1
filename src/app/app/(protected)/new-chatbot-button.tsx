"use client";

import { useCreateChatbotModal } from "@/components/modals/create-chatbot-modal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function NewChatbotButton({
  label = "New Chatbot",
}: {
  label?: string;
}) {
  const [, setCreateChatbotModalOpen, CreateChatBotModal] =
    useCreateChatbotModal();
  return (
    <>
      <Button onClick={() => setCreateChatbotModalOpen(true)}>
        <PlusIcon size={20} className="-ml-1 mr-2" />
        {label}
      </Button>
      <CreateChatBotModal />
    </>
  );
}
