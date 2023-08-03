"use client";

import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { APP_NAME } from "@/lib/constants";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ApiErrorResponse } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { UseModalReturning } from "./types";

const deleteAccountFn = async () => {
  const res = await fetch("/api/users", {
    method: "DELETE",
  });
  const body: ApiErrorResponse = await res.json();
  if (!body.success) {
    throw body.error;
  }
};
const VERIFY_TEXT = "confirm delete account";

export function DeleteAccountModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [verifyText, setVerifyText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { update } = useSession();

  const handleDelete = useCallback(async () => {
    if (isDeleting || !(verifyText === VERIFY_TEXT)) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAccountFn();
      toast({ title: "Account deleted successfully!" });
      await update();
      queryClient.clear();
      router.refresh();
      router.push("/signin");
    } catch (error) {
      setIsDeleting(false);
      toast({
        title: typeof error === "string" ? error : "Failed to delete account!",
        variant: "destructive",
      });
    }
  }, [isDeleting, verifyText, toast, update, queryClient, router]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Warning: This will permanently delete your account and all your{" "}
            {APP_NAME} links and their respective stats.
          </DialogDescription>
        </DialogHeader>
        <div>
          <fieldset className="grid gap-2">
            <Label htmlFor="verify">
              To verify, type <strong>{VERIFY_TEXT}</strong> below
            </Label>
            <Input
              value={verifyText}
              onChange={(e) => setVerifyText(e.currentTarget.value)}
            />
          </fieldset>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={isDeleting || verifyText !== VERIFY_TEXT}
            onClick={handleDelete}
          >
            {isDeleting && (
              <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const useDeleteAccountModal = (): UseModalReturning => {
  const [open, setOpen] = useState(false);

  const Modal = useCallback(
    () => <DeleteAccountModal open={open} onOpenChange={setOpen} />,
    [open],
  );

  return [open, setOpen, Modal];
};
