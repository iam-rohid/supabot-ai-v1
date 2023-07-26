"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  return (
    <div className="flex items-center container">
      <div className="inline relative px-1 pb-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">Chatbots</Link>
        </Button>
        {pathname === "/" && (
          <span className="absolute w-full right-0 bottom-0 h-0.5 bg-primary rounded-t-full" />
        )}
      </div>
      <div className="inline relative px-1 pb-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/settings">Settings</Link>
        </Button>
        {pathname.startsWith("/settings") && (
          <span className="absolute w-full right-0 bottom-0 h-0.5 bg-primary rounded-t-full" />
        )}
      </div>
    </div>
  );
}
