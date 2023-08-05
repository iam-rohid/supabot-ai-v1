"use client";

import { useCallback, useState } from "react";
import { UseModalReturning } from "./types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ApiResponse } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { ProjectInvitation } from "@/lib/types/db-types";

const inviteSchema = z.object({
  email: z.string().min(1).email(),
});

export default function InviteTeammateMoal({
  open,
  onOpenChange,
  projectSlug,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectSlug: string;
}) {
  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
    },
  });
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: z.infer<typeof inviteSchema>) => {
      try {
        const res = await fetch(`/api/projects/${projectSlug}/invitations`, {
          method: "POST",
          body: JSON.stringify(data),
        });
        const resData = (await res.json()) as ApiResponse<ProjectInvitation>;
        if (!resData.success) {
          throw resData.error;
        }
        toast({ title: "Invitations sent" });
        router.refresh();
        onOpenChange(false);
      } catch (error) {
        toast({
          title:
            typeof error === "string" ? error : "Failed to send invitation",
          variant: "destructive",
        });
      }
    },
    [onOpenChange, projectSlug, router, toast],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Teammate</DialogTitle>
          <DialogDescription>
            Invite a teammate to join your project. Invitations will be valid
            for 14 days.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-6">
              <Button
                type="reset"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
                )}
                Invite
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export const useInviteTeammateModal = ({
  projectSlug,
}: {
  projectSlug: string;
}): UseModalReturning => {
  const [open, setOpen] = useState(false);

  const Modal = useCallback(
    () => (
      <InviteTeammateMoal
        open={open}
        onOpenChange={setOpen}
        projectSlug={projectSlug}
      />
    ),
    [projectSlug, open],
  );

  return [open, setOpen, Modal];
};
