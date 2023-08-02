"use client";

import { useAddLinkModal } from "@/components/modals/add-link-modal";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function AddLinkButton() {
  const { projectSlug } = useParams() as { projectSlug: string };
  const [, setOpen, Modal] = useAddLinkModal({ projectSlug: projectSlug });

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Link</Button>
      <Modal />
    </>
  );
}
