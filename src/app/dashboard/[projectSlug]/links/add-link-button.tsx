"use client";

import { useAddLinkModal } from "@/components/modals/add-link-modal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";

export default function AddLinkButton({
  label = "Add Link",
}: {
  label?: string;
}) {
  const { projectSlug } = useParams() as { projectSlug: string };
  const [, setOpen, Modal] = useAddLinkModal({ projectSlug: projectSlug });

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
        {label}
      </Button>
      <Modal />
    </>
  );
}
