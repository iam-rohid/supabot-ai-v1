"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function Nav() {
  const { organization } = useParams();
  const pathname = usePathname();
  const baseUrl = `/${organization}`;
  const settingsUrl = `${baseUrl}/settings`;
  return (
    <div className="container flex items-center">
      <div className="relative -ml-3 inline pb-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={baseUrl}>Chatbots</Link>
        </Button>
        {pathname === baseUrl && (
          <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-t-full bg-primary" />
        )}
      </div>
      <div className="relative inline pb-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={settingsUrl}>Settings</Link>
        </Button>
        {pathname.startsWith(settingsUrl) && (
          <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-t-full bg-primary" />
        )}
      </div>
    </div>
  );
}
