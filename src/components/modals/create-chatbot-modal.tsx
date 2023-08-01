import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import {
  CreateChatbotSchemaData,
  createChatbotSchema,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { ApiResponse } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Chatbot } from "@/lib/schema/chatbots";
import { UseModalReturning } from "./types";

const createChatbotFn = async (data: CreateChatbotSchemaData) => {
  const res = await fetch("/api/chatbots", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const body: ApiResponse<Chatbot> = await res.json();
  if (!body.success) {
    throw body.error;
  }
  return body.data;
};

export function CreateChatbotModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<CreateChatbotSchemaData>({
    resolver: zodResolver(createChatbotSchema),
  });
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSubmit = useCallback(
    async (data: CreateChatbotSchemaData) => {
      try {
        const chatbot = await createChatbotFn(data);
        toast({ title: "Chatbot created successfully!" });
        queryClient.setQueryData<Chatbot[]>(["chatbots"], (chatbots) =>
          chatbots ? [...chatbots, chatbot] : [chatbot],
        );
        router.push(`/${chatbot.slug}`);
        onOpenChange(false);
      } catch (error) {
        toast({
          title:
            typeof error === "string" ? error : "Failed to create chatbot!",
          variant: "destructive",
        });
      }
    },
    [onOpenChange, queryClient, router, toast],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Chatbot</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chatbot Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Chatbot" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chatbot Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="my-chatbot" {...field} />
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
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isDirty || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
                )}
                Create Chatbot
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export const useCreateChatbotModal = (): UseModalReturning => {
  const [open, setOpen] = useState(false);

  const showModal = useCallback(() => {
    setOpen(true);
  }, []);

  const Modal = useCallback(
    () => <CreateChatbotModal open={open} onOpenChange={setOpen} />,
    [open],
  );

  return [open, setOpen, Modal];
};
