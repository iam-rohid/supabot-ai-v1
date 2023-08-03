"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { APP_NAME } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

export default function AcceptInvitationModal({
  projectName,
  projectSlug,
  userEmail,
}: {
  projectName: string;
  projectSlug: string;
  userEmail: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const handleAcceptInvitation = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/projects/${projectSlug}/invitations/accept`,
        {
          method: "POST",
        },
      );
      const resData = await res.json();
      console.log({ resData });
      if (!resData.success) {
        throw resData.error;
      }
      toast({ title: "Invitation successfully accepted" });
    } catch (error) {
      console.error(error);
      toast({
        title:
          typeof error === "string" ? error : "Failed to accept invitation",
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectSlug, toast]);

  const handleCancelInvitation = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/projects/${projectSlug}/invitations/cancel`,
        {
          method: "POST",
        },
      );
      const resData = await res.json();
      console.log({ resData });
      if (!resData.success) {
        throw resData.error;
      }
      toast({ title: "Invitation successfully accepted" });
    } catch (error) {
      console.error(error);
      toast({
        title:
          typeof error === "string" ? error : "Failed to accept invitation",
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectSlug, toast]);

  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Project Invitation</AlertDialogTitle>
          <AlertDialogDescription>
            You&apos;ve been invited to join and collaborate on the{" "}
            {projectName} project on {APP_NAME}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button
              variant="ghost"
              onClick={handleCancelInvitation}
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
              )}
              Cancel
            </Button>
            <Button onClick={handleAcceptInvitation} disabled={isLoading}>
              {isLoading && (
                <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
              )}
              Accept Invitation
            </Button>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
