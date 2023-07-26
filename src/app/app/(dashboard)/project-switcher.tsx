"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function ProjectSwitcher() {
  const { status, data } = useSession();
  const [open, setOpen] = useState(false);
  if (status !== "authenticated") {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="px-2 -mx-2">
          <Avatar className="w-7 h-7 mr-2">
            <AvatarImage
              src={data.user?.image || `/api/avatar/${data.user.email}`}
            />
          </Avatar>
          {data.user.name}
          <ChevronsUpDownIcon size={18} className="ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm text-muted-foreground mb-2">Personal Account</p>
        <Button
          className="w-full text-left justify-start"
          variant="ghost"
          asChild
          onClick={() => setOpen(false)}
        >
          <Link href="/">
            <Avatar className="w-7 h-7 mr-2 -ml-1">
              <AvatarImage
                src={data.user?.image || `/api/avatar/${data.user.email}`}
              />
            </Avatar>
            <span className="flex-1 truncate">Rohid</span>
            <CheckIcon size={18} className="ml-2 -mr-1" />
          </Link>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
