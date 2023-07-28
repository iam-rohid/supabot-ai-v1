"use client";

import ThemeSwitcher from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/user-button";
import Link from "next/link";
import { ReactNode, createContext, useContext, useState } from "react";
import OrganizationSwitcher from "./organization-switcher";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ChatbotSwitcher from "./chatbot-switcher";

export type AppHeaderContextType = {
  organization: string | null;
  chatbot: string | null;
  setOrganization: (orgId: string | null) => void;
  setChatbot: (botId: string | null) => void;
};
export const AppHeaerContext = createContext<AppHeaderContextType | null>(null);

export default function WithAppHeader({ children }: { children: ReactNode }) {
  const [organization, setOrganization] = useState<string | null>(null);
  const [chatbot, setChatbot] = useState<string | null>(null);

  return (
    <AppHeaerContext.Provider
      value={{
        chatbot,
        organization,
        setOrganization,
        setChatbot,
      }}
    >
      <header className="border-b bg-card text-card-foreground">
        <div className="container flex h-16 items-center justify-between">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href={`/${organization || ""}`}>
              <div className="h-10 w-10 rounded-full bg-accent-foreground" />
            </Link>
          </Button>
          {organization && (
            <>
              <span className="mx-4 text-2xl text-muted-foreground/50">/</span>
              <OrganizationSwitcher organization={organization} />
              {chatbot && (
                <>
                  <span className="mx-4 text-2xl text-muted-foreground/50">
                    /
                  </span>
                  <ChatbotSwitcher
                    organization={organization}
                    chatbot={chatbot}
                  />
                </>
              )}
            </>
          )}
          <div className="flex flex-1 items-center justify-end gap-4">
            <ThemeSwitcher />
            <UserButton />
          </div>
        </div>
        <NavBar
          menuList={
            chatbot && organization
              ? [
                  {
                    href: `/${organization}/${chatbot}`,
                    label: "Overview",
                    exactMatch: true,
                  },
                  {
                    href: `/${organization}/${chatbot}/settings`,
                    label: "Settings",
                  },
                ]
              : organization
              ? [
                  {
                    href: `/${organization}`,
                    label: "Overview",
                    exactMatch: true,
                  },
                  {
                    href: `/${organization}/settings`,
                    label: "Settings",
                  },
                ]
              : []
          }
        />
      </header>
      {children}
    </AppHeaerContext.Provider>
  );
}

export const useAppHeader = () => {
  const context = useContext(AppHeaerContext);
  if (!context) {
    throw "useAppHeader must use inside WithAppHeader";
  }
  return context;
};

type MenuItem = {
  href: string;
  label: string;
  exactMatch?: boolean;
};
function NavBar({ menuList }: { menuList: MenuItem[] }) {
  const pathname = usePathname();
  if (menuList.length === 0) {
    return null;
  }
  return (
    <nav className="border-b bg-card text-card-foreground">
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
    </nav>
  );
}
