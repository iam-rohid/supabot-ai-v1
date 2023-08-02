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
import { LogOutIcon, SettingsIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

export default function UserButton() {
  const { status, data } = useSession();
  const { toast } = useToast();
  const router = useRouter();

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

  if (status !== "authenticated") {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Image
            src={data.user.image || `/api/avatar/${data.user.id}`}
            className="h-10 w-10 rounded-full object-cover"
            width={256}
            height={256}
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
            <Link href="/dashboard/settings">
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
