import ThemeSwitcher from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/user-button";
import Link from "next/link";
import React, { ReactNode } from "react";

export default function BaseLayout({
  children,
  ...rest
}: {
  children: ReactNode;
}) {
  return (
    <>
      <header className="border-b bg-card text-card-foreground">
        <div className="container flex h-16 items-center justify-between">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/">
              <div className="h-10 w-10 rounded-full bg-accent-foreground" />
            </Link>
          </Button>
          <div className="flex flex-1 items-center justify-end gap-4">
            <ThemeSwitcher />
            <UserButton />
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
