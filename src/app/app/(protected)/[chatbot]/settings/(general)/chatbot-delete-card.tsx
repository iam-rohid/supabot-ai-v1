"use client";

import { useChatbots } from "@/components/chatbots-provider";
import { useDeleteChatbotModal } from "@/components/modals/delete-chatbot-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

export default function ChatbotDeleteCard() {
  const { currentChatbot } = useChatbots();
  const { Modal, showModal } = useDeleteChatbotModal();
  return (
    <>
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Delete Chatbot</CardTitle>
          <CardDescription>
            Permanently delete your chatbot on {APP_NAME}, and their stats. This
            action cannot be undone - please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            variant="destructive"
            onClick={
              currentChatbot ? () => showModal(currentChatbot) : undefined
            }
          >
            Delete Chatbot
          </Button>
        </CardFooter>
      </Card>
      <Modal />
    </>
  );
}
