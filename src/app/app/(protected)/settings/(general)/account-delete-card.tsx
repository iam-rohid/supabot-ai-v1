"use client";

import { useDeleteAccountModal } from "@/components/modals/delete-account-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

export default function AccountDeleteCard() {
  const [, setDeleteModalOpen, DeleteModal] = useDeleteAccountModal();
  return (
    <>
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Delete My Account</CardTitle>
          <CardDescription>
            Permanently delete your {APP_NAME} account and all of your chatbots
            + their stats. This action cannot be undone - please proceed with
            caution.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            variant="destructive"
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete Account
          </Button>
        </CardFooter>
      </Card>
      <DeleteModal />
    </>
  );
}
