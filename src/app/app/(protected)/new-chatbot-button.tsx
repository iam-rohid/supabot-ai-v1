"use client";

import { useCreateChatbotModal } from "@/components/modals/create-chatbot-modal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function NewChatbotButton({
  label = "New Chatbot",
}: {
  label?: string;
}) {
  const { Modal: CreateChatBotModal, showModal: createChatbot } =
    useCreateChatbotModal();
  return (
    <>
      <Button onClick={createChatbot}>
        <PlusIcon size={20} className="-ml-1 mr-2" />
        {label}
      </Button>
      <CreateChatBotModal />
    </>
  );
}
