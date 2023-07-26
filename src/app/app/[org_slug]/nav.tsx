"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function Nav() {
  const { org_slug } = useParams();
  const pathname = usePathname();
  const baseUrl = `/${org_slug}`;
  return (
    <div className="flex items-center container">
      <div className="inline relative px-1 pb-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={baseUrl}>Chatbots</Link>
        </Button>
        {pathname === baseUrl && (
          <span className="absolute w-full right-0 bottom-0 h-0.5 bg-primary rounded-t-full" />
        )}
      </div>
      <div className="inline relative px-1 pb-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={`${baseUrl}/settings`}>Settings</Link>
        </Button>
        {pathname.startsWith("/settings") && (
          <span className="absolute w-full right-0 bottom-0 h-0.5 bg-primary rounded-t-full" />
        )}
      </div>
    </div>
  );
}
