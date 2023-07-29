import ChatbotNameCard from "./chatbot-name-card";
import ChatbotSlugCard from "./chatbot-slug-card";
import ChatbotDeleteCard from "./chatbot-delete-card";
import { db } from "@/lib/drizzle";
import { chatbotsTable } from "@/lib/schema/chatbots";
import { eq } from "drizzle-orm";

export default async function ChatbotSettingsPage({
  params,
}: {
  params: { chatbot: string };
}) {
  const [chatbot] = await db
    .select()
    .from(chatbotsTable)
    .where(eq(chatbotsTable.slug, params.chatbot));

  return (
    <div className="grid gap-8">
      <ChatbotNameCard chatbot={chatbot} />
      <ChatbotSlugCard chatbot={chatbot} />
      <ChatbotDeleteCard chatbot={chatbot} />
    </div>
  );
}
