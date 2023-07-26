"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Organization } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function OrganizationSwitcher() {
  const { data } = useSession();
  const { org_slug } = useParams();
  const orgsQuery = useQuery({
    queryKey: ["organizations", data?.user.id],
    queryFn: async () => {
      const res = await fetch("/api/organizations");
      if (!res.ok) {
        throw res.statusText;
      }
      return (await res.json()) as Organization[];
    },
  });

  const currentOrg = useMemo(
    () => orgsQuery.data?.find((org) => org.slug === org_slug),
    [org_slug, orgsQuery.data]
  );

  if (!orgsQuery.isSuccess) {
    return (
      <Button disabled className="px-2 -mx-2 bg-muted">
        <Avatar className="w-6 h-6 mr-2">
          <AvatarFallback className="w-full h-full bg-foreground/10" />
        </Avatar>
        <span className="w-20 h-4 bg-foreground/10 rounded-sm"></span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2 -mx-2">
          <Avatar className="w-6 h-6 mr-2">
            <AvatarImage src={`/api/avatar/${currentOrg?.slug}`} />
          </Avatar>
          {currentOrg?.name}
          <ChevronsUpDownIcon size={18} className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {orgsQuery.data.map((org) => (
          <DropdownMenuItem key={org.id} asChild>
            <Link href={`/${org.slug}`}>
              <Avatar className="w-5 h-5 mr-2">
                <AvatarImage src={`/api/avatar/${org.slug}`} />
              </Avatar>
              <span className="flex-1 truncate">{org.name}</span>
              <CheckIcon
                size={18}
                className={cn("ml-3 opacity-0", {
                  "opacity-100": org_slug === org.slug,
                })}
              />
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/new-org">
            <PlusIcon size={18} className="mr-2" />
            Create Organization
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
