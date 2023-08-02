"use client";

import { useCreateProjectModal } from "@/components/modals/create-chatbot-modal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function NewProjectButton({
  label = "New Project",
}: {
  label?: string;
}) {
  const [, setOpen, Modal] = useCreateProjectModal();
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon size={20} className="-ml-1 mr-2" />
        {label}
      </Button>
      <Modal />
    </>
  );
}
