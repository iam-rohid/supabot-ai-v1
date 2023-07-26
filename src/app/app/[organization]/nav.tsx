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
    <div className="flex items-center container">
      <div className="inline relative pb-2 -ml-3">
        <Button asChild variant="ghost" size="sm">
          <Link href={baseUrl}>Chatbots</Link>
        </Button>
        {pathname === baseUrl && (
          <span className="absolute left-3 right-3 bottom-0 h-0.5 bg-primary rounded-t-full" />
        )}
      </div>
      <div className="inline relative pb-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={settingsUrl}>Settings</Link>
        </Button>
        {pathname.startsWith(settingsUrl) && (
          <span className="absolute left-3 right-3 bottom-0 h-0.5 bg-primary rounded-t-full" />
        )}
      </div>
    </div>
  );
}
