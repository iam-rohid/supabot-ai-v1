"use client";

import { Button } from "@/components/ui/button";
import { MenuItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ items }: { items: MenuItem[] }) {
  const pathname = usePathname();

  return (
    <div className="grid w-64 flex-shrink-0 gap-1">
      {items.map((item, i) => (
        <Button
          key={i}
          asChild
          variant="ghost"
          className={cn("justify-start text-left text-muted-foreground", {
            "bg-secondary text-accent-foreground": item.exactMatch
              ? pathname === item.href
              : pathname.startsWith(item.href),
          })}
        >
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}
    </div>
  );
}
