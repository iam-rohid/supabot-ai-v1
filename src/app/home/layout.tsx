import { Button } from "@/components/ui/button";
import { APP_DOMAIN, APP_NAME, HOME_DOMAIN } from "@/lib/constants";
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
      <header className="bg-card text-card-foreground border-b">
        <div className="container h-16 flex items-center justify-between">
          <Link
            href={HOME_DOMAIN}
            className="text-xl font-bold text-accent-foreground"
          >
            {APP_NAME}
          </Link>
          <div className="flex items-center">
            <nav className="flex items-center gap-8 mr-8">
              <Link
                className="text-sm font-medium hover:text-accent-foreground text-muted-foreground"
                href="/"
              >
                Home
              </Link>
              <Link
                className="text-sm font-medium hover:text-accent-foreground text-muted-foreground"
                href="/pricing"
              >
                Pricing
              </Link>
            </nav>
            <Button variant="ghost" asChild className="mr-3">
              <Link href={`${APP_DOMAIN}/login`}>Sign In</Link>
            </Button>
            <Button>
              <Link href={`${APP_DOMAIN}/register`}>Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}