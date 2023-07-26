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
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function OrganizationSwitcher() {
  const { data } = useSession();
  const { organization } = useParams();
  const orgsQuery = useQuery<{ name: string; slug: string }[]>({
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
    [organization, orgsQuery.data]
  );

  if (!orgsQuery.isSuccess) {
    return (
      <div className="pl-2 -mx-2 pr-4 h-10 rounded-md bg-muted flex items-center">
        <div className="w-6 h-6 rounded-full bg-foreground/10 mr-2" />
        <div className="w-20 h-4 rounded-sm bg-foreground/10" />
      </div>
    );
  }

  if (!currentOrg) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2 -mx-2">
          <img
            src={`/api/avatar/${currentOrg?.slug}`}
            className="w-6 h-6 mr-2 rounded-full object-cover"
            alt="Organization avatar"
          />
          {currentOrg?.name}
          <ChevronsUpDownIcon size={20} className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {orgsQuery.data.map((org) => (
          <DropdownMenuItem key={org.slug} asChild>
            <Link href={`/${org.slug}`}>
              <img
                src={`/api/avatar/${org.slug}`}
                alt="Organization Image"
                className="w-5 h-5 rounded-full object-cover mr-2"
              />
              <span className="flex-1 truncate">{org.name}</span>
              <CheckIcon
                size={20}
                className={cn("ml-3 opacity-0", {
                  "opacity-100": organization === org.slug,
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
