import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";
import Nav from "./nav";
import UserButton from "./user-button";
import ThemeSwitcher from "@/components/theme-switcher";
import OrganizationSwitcher from "./organization-switcher";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: APP_NAME,
};

export default async function OrganizationLayout({
  children,
  params: { organization },
}: {
  children: React.ReactNode;
  params: {
    organization: string;
  };
}) {
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <header className="border-b bg-card text-card-foreground">
        <div className="container h-16 flex items-center justify-between">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href={`/${organization}`}>
              <div className="w-8 h-8 rounded-full bg-accent-foreground" />
            </Link>
          </Button>
          <span className="text-2xl text-muted-foreground/50 mx-4">/</span>
          <OrganizationSwitcher />
          <div className="flex flex-1 justify-end items-center gap-4">
            <ThemeSwitcher />
            <UserButton />
          </div>
        </div>
        <Nav />
      </header>
      {children}
    </div>
  );
}
