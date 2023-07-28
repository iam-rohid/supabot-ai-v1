/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDomLoaded } from "@/hooks/useDomLoaded";
import { cn } from "@/lib/utils";
import { Organization } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo } from "react";

export default function OrganizationSwitcher({
  organization,
}: {
  organization: string;
}) {
  const { data } = useSession();
  const domLoaded = useDomLoaded();

  const orgsQuery = useQuery<Organization[]>({
    queryKey: ["organizations", data?.user.id],
    queryFn: async () => {
      const res = await fetch("/api/organizations");
      if (!res.ok) {
        throw res.statusText;
      }
      return res.json();
    },
  });

  const currentOrg = useMemo(
    () => orgsQuery.data?.find((org) => org.slug === organization),
    [organization, orgsQuery.data],
  );

  if (!domLoaded || !orgsQuery.isSuccess) {
    return (
      <div className="-mx-2 flex h-10 items-center rounded-md bg-muted pl-2 pr-4">
        <div className="mr-2 h-6 w-6 rounded-full bg-foreground/10" />
        <div className="h-4 w-20 rounded-sm bg-foreground/10" />
      </div>
    );
  }

  if (!currentOrg) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="-mx-2 px-2">
          <img
            src={`/api/avatar/${currentOrg.id}`}
            className="mr-2 h-6 w-6 rounded-full object-cover"
            alt="Organization avatar"
          />
          {currentOrg.name}
          <ChevronsUpDownIcon size={20} className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {orgsQuery.data.map((org) => (
          <DropdownMenuItem key={org.slug} asChild>
            <Link href={`/${org.slug}`}>
              <img
                src={`/api/avatar/${org.id}`}
                alt="Organization Image"
                className="mr-2 h-5 w-5 rounded-full object-cover"
              />
              <span className="flex-1 truncate">{org.name}</span>
              <CheckIcon
                size={20}
                className={cn("ml-3 opacity-0", {
                  "opacity-100": org.id === currentOrg.id,
                })}
              />
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/new-org">
            <PlusIcon size={20} className="mr-2" />
            Create Organization
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
