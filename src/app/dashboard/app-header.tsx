"use client";

import ThemeSwitcher from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/user-button";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ProjectSwitcher from "@/components/project-switcher";
import type { MenuItem } from "@/lib/types";

export default function AppHeader() {
  const { projectSlug } = useParams();

  return (
    <header className="sticky top-0 z-20 border-b bg-card text-card-foreground">
      <div className="container flex h-16 items-center justify-between">
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/dashboard">
            <div className="h-10 w-10 rounded-full bg-accent-foreground" />
          </Link>
        </Button>
        <span className="mx-4 text-2xl text-muted-foreground/50">/</span>
        <ProjectSwitcher />
        <div className="flex flex-1 items-center justify-end gap-4">
          <ThemeSwitcher />
          <UserButton />
        </div>
      </div>
      <NavBar
        menuList={
          typeof projectSlug === "string"
            ? [
                {
                  href: `/dashboard/${projectSlug}`,
                  label: "Overview",
                  exactMatch: true,
                },
                {
                  href: `/dashboard/${projectSlug}/links`,
                  label: "Links",
                },
                {
                  href: `/dashboard/${projectSlug}/settings`,
                  label: "Settings",
                },
              ]
            : [
                {
                  href: "/dashboard",
                  label: "Overview",
                  exactMatch: true,
                },
                {
                  href: "/dashboard/settings",
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
