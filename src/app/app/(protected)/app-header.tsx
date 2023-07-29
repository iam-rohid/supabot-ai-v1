"use client";

import ThemeSwitcher from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/user-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ChatbotSwitcher from "./chatbot-switcher";
import { useChatbots } from "@/components/chatbots-provider";
import type { MenuItem } from "@/lib/types";

export default function AppHeader() {
  const { currentChatbot } = useChatbots();
  return (
    <header className="sticky top-0 z-20 border-b bg-card text-card-foreground">
      <div className="container flex h-16 items-center justify-between">
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/">
            <div className="h-10 w-10 rounded-full bg-accent-foreground" />
          </Link>
        </Button>
        <span className="mx-4 text-2xl text-muted-foreground/50">/</span>
        <ChatbotSwitcher />
        <div className="flex flex-1 items-center justify-end gap-4">
          <ThemeSwitcher />
          <UserButton />
        </div>
      </div>
      <NavBar
        menuList={
          currentChatbot
            ? [
                {
                  href: `/${currentChatbot.slug}`,
                  label: "Overview",
                  exactMatch: true,
                },
                {
                  href: `/${currentChatbot.slug}/pages`,
                  label: "Pages",
                },
                {
                  href: `/${currentChatbot.slug}/settings`,
                  label: "Settings",
                },
              ]
            : [
                {
                  href: "/",
                  label: "Overview",
                  exactMatch: true,
                },
                {
                  href: "/settings",
                  label: "Settings",
                },
              ]
        }
      />
    </header>
  );
}

function NavBar({ menuList }: { menuList: MenuItem[] }) {
  const pathname = usePathname();
  if (menuList.length === 0) {
    return null;
  }
  return (
    <div className="container flex items-center">
      {menuList.map((item, i) => (
        <div
          key={i}
          className={cn("relative inline pb-2", {
            "-ml-3": i === 0,
          })}
        >
          <Button asChild variant="ghost" size="sm">
            <Link href={item.href}>{item.label}</Link>
          </Button>
          {(item.exactMatch
            ? pathname === item.href
            : pathname.startsWith(item.href)) && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-t-full bg-primary" />
          )}
        </div>
      ))}
    </div>
  );
}
