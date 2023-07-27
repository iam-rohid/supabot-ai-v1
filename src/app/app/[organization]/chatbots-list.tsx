import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default async function ChatbotsList({
  organization,
}: {
  organization: string;
}) {
  const chatbots = await prisma.chatbot.findMany({
    where: {
      organization: {
        slug: organization,
      },
    },
  });
  return (
    <div className="container grid grid-cols-3 gap-8 py-8">
      {chatbots.map((chatbot) => (
        <Link
          key={chatbot.id}
          href={`/${organization}/${chatbot.id}`}
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
                {formatDistanceToNow(chatbot.updatedAt, { addSuffix: true })}
              </p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
