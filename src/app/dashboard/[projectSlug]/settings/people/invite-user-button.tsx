"use client";

import { useInviteTeammateModal } from "@/components/modals/invite-teammate-modal";
import { Button } from "@/components/ui/button";

export default function InviteUserButton({
  projectSlug,
  label = "Invite Teammate",
}: {
  projectSlug: string;
  label?: string;
}) {
  const [, setOpen, Modal] = useInviteTeammateModal({ projectSlug });
  return (
    <>
      <Button onClick={() => setOpen(true)}>{label}</Button>
      <Modal />
    </>
  );
}
