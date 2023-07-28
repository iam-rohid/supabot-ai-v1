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
import { useToast } from "@/components/ui/use-toast";
import { useDomLoaded } from "@/hooks/useDomLoaded";
import { LogOutIcon, SettingsIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserButton() {
  const { status, data } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const domLoaded = useDomLoaded();

  const handleSignOut = async () => {
    try {
      await signOut({
        redirect: false,
      });
      localStorage.clear();
      toast({ title: "Sign out success" });
      router.push("/signin");
    } catch (error) {
      toast({
        title: "Failed to signout!",
        variant: "destructive",
      });
    }
  };

  if (!domLoaded || status !== "authenticated") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted" />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <img
            src={data.user.image || `/api/avatar/${data.user.id}`}
            className="h-10 w-10 rounded-full object-cover"
            alt="User avatar"
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
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon size={20} className="mr-2" />
            <div className="flex-1 truncate">Log Out</div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
