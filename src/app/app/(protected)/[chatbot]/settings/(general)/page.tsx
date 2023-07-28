import ChatbotNameCard from "./chatbot-name-card";
import ChatbotSlugCard from "./chatbot-slug-card";
import ChatbotDeleteCard from "./chatbot-delete-card";
import { prisma } from "@/lib/prisma";
import { Chatbot } from "@prisma/client";

export default async function ChatbotSettingsPage({
  params,
}: {
  params: { chatbot: string };
}) {
  const chatbot = (await prisma.chatbot.findFirst({
    where: {
      slug: params.chatbot,
    },
  })) as Chatbot;

  return (
    <div className="grid gap-8">
      <ChatbotNameCard chatbot={chatbot} />
      <ChatbotSlugCard chatbot={chatbot} />
      <ChatbotDeleteCard chatbot={chatbot} />
    </div>
  );
}
