import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";
import Nav from "./nav";
import UserButton from "./user-button";
import OrganizationSwitcher from "./organization-switcher";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/theme-switcher";

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
    <div className="flex min-h-screen flex-col bg-muted">
      <header className="border-b bg-card text-card-foreground">
        <div className="container flex h-16 items-center justify-between">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href={`/${organization}`}>
              <div className="h-8 w-8 rounded-full bg-accent-foreground" />
            </Link>
          </Button>
          <span className="mx-4 text-2xl text-muted-foreground/50">/</span>
          <OrganizationSwitcher />
          <div className="flex flex-1 items-center justify-end gap-4">
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
