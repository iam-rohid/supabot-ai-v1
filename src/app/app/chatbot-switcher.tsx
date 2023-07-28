/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDomLoaded } from "@/hooks/useDomLoaded";
import { cn } from "@/lib/utils";
import { Chatbot } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function ChatbotSwitcher({
  chatbot,
  organization,
}: {
  chatbot: string;
  organization: string;
}) {
  const domLoaded = useDomLoaded();
  const chatbotsQuery = useQuery<Chatbot[]>({
    queryKey: ["chatbots", organization],
    queryFn: async () => {
      const res = await fetch(`/api/organizations/${organization}/chatbots`);
      if (!res.ok) {
        throw res.statusText;
      }
      return res.json();
    },
  });

  const currentBot = useMemo(
    () => chatbotsQuery.data?.find((bot) => bot.id === chatbot),
    [chatbot, chatbotsQuery.data],
  );

  if (!domLoaded || !chatbotsQuery.isSuccess) {
    return (
      <div className="-mx-2 flex h-10 items-center rounded-md bg-muted pl-2 pr-4">
        <div className="mr-2 h-6 w-6 rounded-full bg-foreground/10" />
        <div className="h-4 w-20 rounded-sm bg-foreground/10" />
      </div>
    );
  }

  if (!currentBot) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="-mx-2 px-2">
          <img
            src={`/api/avatar/${currentBot.id}`}
            className="mr-2 h-6 w-6 rounded-full object-cover"
            alt="Organization avatar"
          />
          {currentBot.name}
          <ChevronsUpDownIcon size={20} className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {chatbotsQuery.data.map((item) => (
          <DropdownMenuItem key={item.id} asChild>
            <Link href={`/${organization}/${item.id}`}>
              <img
                src={`/api/avatar/${item.id}`}
                alt="Organization Image"
                className="mr-2 h-5 w-5 rounded-full object-cover"
              />
              <span className="flex-1 truncate">{item.name}</span>
              <CheckIcon
                size={20}
                className={cn("ml-3 opacity-0", {
                  "opacity-100": item.id === currentBot.id,
                })}
              />
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/new?org=${organization}`}>
            <PlusIcon size={20} className="mr-2" />
            Create Chatbot
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
