"use client";

import { useCreateProjectModal } from "@/components/modals/create-project-modal";
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
        <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
        {label}
      </Button>
      <Modal />
    </>
  );
}
