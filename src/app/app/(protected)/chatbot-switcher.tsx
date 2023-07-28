/* eslint-disable @next/next/no-img-element */
"use client";

import { useChatbots } from "@/components/chatbots-provider";
import { useCreateChatbotModal } from "@/components/modals/create-chatbot-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDomLoaded } from "@/hooks/useDomLoaded";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ChatbotSwitcher() {
  const { data } = useSession();
  const { currentChatbot, chatbots, isLoading } = useChatbots();
  const { Modal: CreateChatBotModal, showModal: createChatbot } =
    useCreateChatbotModal();
  const domLoaded = useDomLoaded();

  if (!domLoaded || isLoading || !data) {
    return (
      <div className="-mx-2 flex h-10 items-center rounded-md bg-muted pl-2 pr-4">
        <div className="mr-2 h-6 w-6 rounded-full bg-foreground/10" />
        <div className="h-4 w-20 rounded-sm bg-foreground/10" />
      </div>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="-mx-2 px-2">
            <img
              src={
                currentChatbot
                  ? `/api/avatar/${currentChatbot.id}`
                  : data.user.image || `/api/avatar/${data.user.id}`
              }
              className="mr-2 h-6 w-6 rounded-full object-cover"
              alt="Chatbot logo"
            />
            {currentChatbot?.name || data.user.name}
            <ChevronsUpDownIcon size={20} className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Personal Account</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/">
                <img
                  src={data.user.image || `/api/avatar/${data.user.id}`}
                  alt="Chatbot logo"
                  className="mr-2 h-5 w-5 rounded-full object-cover"
                />
                <span className="flex-1 truncate">
                  {data.user.name || "No name"}
                </span>
                <CheckIcon
                  size={20}
                  className={cn("ml-3 opacity-0", {
                    "opacity-100": !currentChatbot,
                  })}
                />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Chabots</DropdownMenuLabel>
            {chatbots.map((item) => (
              <DropdownMenuItem key={item.slug} asChild>
                <Link href={`/${item.slug}`}>
                  <img
                    src={`/api/avatar/${item.id}`}
                    alt="Chatbot logo"
                    className="mr-2 h-5 w-5 rounded-full object-cover"
                  />
                  <span className="flex-1 truncate">{item.name}</span>
                  <CheckIcon
                    size={20}
                    className={cn("ml-3 opacity-0", {
                      "opacity-100":
                        currentChatbot && item.slug === currentChatbot.slug,
                    })}
                  />
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={createChatbot}>
            <PlusIcon size={20} className="mr-2" />
            New Chatbot
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateChatBotModal />
    </>
  );
}
