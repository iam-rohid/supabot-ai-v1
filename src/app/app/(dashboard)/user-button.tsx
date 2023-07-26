"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, SettingsIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserButton() {
  const { status, data } = useSession();
  const pathname = usePathname();
  if (status !== "authenticated") {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full inline-flex">
        <Avatar>
          <AvatarFallback></AvatarFallback>
          <AvatarImage
            src={data.user?.image || `/api/avatar/${data.user.email}`}
          />
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="end">
        <div className="p-3">
          <p className="font-medium leading-none">{data.user.name}</p>
          <p className="text-sm text-muted-foreground">{data.user.email}</p>
        </div>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <SettingsIcon size={18} className="mr-2" />
              <div className="flex-1 truncate">Settings</div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOutIcon size={18} className="mr-2" />
            <div className="flex-1 truncate">Log Out</div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
