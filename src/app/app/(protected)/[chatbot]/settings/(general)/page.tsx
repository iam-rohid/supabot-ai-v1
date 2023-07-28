import ChatbotNameCard from "./chatbot-name-card";
import ChatbotSlugCard from "./chatbot-slug-card";
import ChatbotDeleteCard from "./chatbot-delete-card";

export default function ChatbotSettingsPage() {
  return (
    <div className="grid gap-8">
      <ChatbotNameCard />
      <ChatbotSlugCard />
      <ChatbotDeleteCard />
    </div>
  );
}
