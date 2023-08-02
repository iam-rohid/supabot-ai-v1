"use client";

import { useAddLinkModal } from "@/components/modals/add-link-modal";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function AddLinkButton() {
  const { project_slug } = useParams() as { project_slug: string };
  const [, setOpen, Modal] = useAddLinkModal({ projectSlug: project_slug });

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Link</Button>
      <Modal />
    </>
  );
}
