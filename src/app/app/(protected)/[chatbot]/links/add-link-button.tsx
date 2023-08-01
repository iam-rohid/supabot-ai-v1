"use client";

import { useAddLinkModal } from "@/components/modals/add-link-modal";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function AddLinkButton() {
  const { chatbot } = useParams() as { chatbot: string };
  const [, setOpen, Modal] = useAddLinkModal({ chatbot: chatbot });

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Link</Button>
      <Modal />
    </>
  );
}
