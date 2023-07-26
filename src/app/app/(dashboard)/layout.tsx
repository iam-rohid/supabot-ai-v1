import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";
import Nav from "./nav";
import UserButton from "./user-button";
import ThemeSwitcher from "@/components/theme-switcher";

export const metadata: Metadata = {
  title: APP_NAME,
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <header className="border-b bg-card text-card-foreground">
        <div className="container h-16 flex items-center justify-between">
          <Link href="/">
            <div className="w-8 h-8 rounded-full bg-accent-foreground" />
          </Link>
          <div className="flex items-center gap-4">
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
