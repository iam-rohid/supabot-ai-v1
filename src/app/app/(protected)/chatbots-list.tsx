"use client";

import { useChatbots } from "@/components/chatbots-provider";
import { useCreateChatbotModal } from "@/components/modals/create-chatbot-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default function ChatbotsList() {
  const { chatbots, isLoading } = useChatbots();
  const { Modal: CreateChatBotModal, showModal: createChatbot } =
    useCreateChatbotModal();

  return (
    <div className="container py-8">
      {isLoading ? (
        <p>Loading...</p>
      ) : chatbots.length > 0 ? (
        <div className="grid grid-cols-3 gap-8">
          {chatbots.map((chatbot) => (
            <Link
              key={chatbot.slug}
              href={`/${chatbot.slug}`}
              className="group"
            >
              <Card className="group-hover:border-foreground/20">
                <CardHeader>
                  <CardTitle className="text-lg">{chatbot.name}</CardTitle>
                  <CardDescription>
                    {chatbot.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Last updated{" "}
                    {formatDistanceToNow(new Date(chatbot.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <CardHeader>
            <CardTitle>You don&apos;t have any chatbots yet!</CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              src="/assets/empty-artwork.svg"
              width={512}
              height={512}
              className="max-h-64 w-full object-contain"
              alt="Empty Artwork"
            />
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={createChatbot}>Create a chatbot</Button>
          </CardFooter>
        </Card>
      )}

      <CreateChatBotModal />
    </div>
  );
}
