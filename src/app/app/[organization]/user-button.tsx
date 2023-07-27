/* eslint-disable @next/next/no-img-element */
"use client";
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
import { useParams } from "next/navigation";

export default function UserButton() {
  const { status, data } = useSession();
  const { organization } = useParams();
  if (status !== "authenticated") {
    return (
      <div className="flex h-10 w-10 items-center justify-center">
        <div className="h-8 w-8 rounded-full bg-muted" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <img
            src={data.user.image || `/api/avatar/${data.user.id}`}
            className="h-8 w-8 rounded-full object-cover"
            alt="Organization avatar"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <div className="p-3">
          <p className="font-medium leading-none">
            {data.user.name || "No name"}
          </p>
          <p className="text-sm text-muted-foreground">{data.user.email}</p>
        </div>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <SettingsIcon size={20} className="mr-2" />
              <div className="flex-1 truncate">Settings</div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOutIcon size={20} className="mr-2" />
            <div className="flex-1 truncate">Log Out</div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
