"use client";

import { useDeleteProjectModal } from "@/components/modals/delete-project-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Project } from "@/lib/schema/projects";
import { useParams } from "next/navigation";

export default function ProjectDeleteCard() {
  const { projectSlug } = useParams() as { projectSlug: string };
  const [, setDeleteProjectModalOpen, DeleteProjectModal] =
    useDeleteProjectModal({ projectSlug });

  return (
    <>
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Delete Project</CardTitle>
          <CardDescription>
            Permanently delete your project on {APP_NAME}, and their stats. This
            action cannot be undone - please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            variant="destructive"
            onClick={() => setDeleteProjectModalOpen(true)}
          >
            Delete Project
          </Button>
        </CardFooter>
      </Card>
      <DeleteProjectModal />
    </>
  );
}
