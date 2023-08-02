import { Button } from "@/components/ui/button";
import { APP_NAME, HOME_DOMAIN } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: `Welcome to ${APP_NAME}`,
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="border-b bg-card text-card-foreground">
        <div className="container flex h-16 items-center justify-between">
          <Link
            href={HOME_DOMAIN}
            className="text-xl font-bold text-accent-foreground"
          >
            {APP_NAME}
          </Link>
          <div className="flex items-center">
            <nav className="mr-8 flex items-center gap-8">
              <Link
                className="text-sm font-medium text-muted-foreground hover:text-accent-foreground"
                href="/"
              >
                Home
              </Link>
              <Link
                className="text-sm font-medium text-muted-foreground hover:text-accent-foreground"
                href="/pricing"
              >
                Pricing
              </Link>
            </nav>
            <Button variant="ghost" asChild className="mr-3">
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button>
              <Link
                href={{
                  pathname: "/signin",
                  query: new URLSearchParams({ next: "/pricing" }).toString(),
                }}
              >
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
