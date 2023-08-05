"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProjectInvitation } from "@/lib/types/db-types";
import { MoreVertical } from "lucide-react";

export default function InvitationRowActionDropdownButton({
  invitation,
  projectSlug,
}: {
  invitation: ProjectInvitation;
  projectSlug: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Resend Email</DropdownMenuItem>
        <DropdownMenuItem>Delete Invitation</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
