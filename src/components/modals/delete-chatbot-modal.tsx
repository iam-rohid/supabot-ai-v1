import { useCallback, useMemo, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { ApiErrorResponse } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Chatbot } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";

const deleteChatbotFn = async (slug: string) => {
  const res = await fetch(`/api/chatbots/${slug}`, {
    method: "DELETE",
  });
  const body: ApiErrorResponse = await res.json();
  if (!body.success) {
    throw body.error;
  }
};

const VERIFY_MESSAGE = "confirm delete chatbot";

export function DeleteChatbotModal({
  open,
  onOpenChange,
  chatbot,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatbot: Chatbot;
}) {
  const [chatbotSlug, setChatbotSlug] = useState("");
  const [verifyText, setVerifyText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleDelete = useCallback(async () => {
    if (
      isDeleting ||
      !(chatbotSlug === chatbot.slug && verifyText === VERIFY_MESSAGE)
    ) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteChatbotFn(chatbot.slug);
      queryClient.setQueryData<Chatbot[]>(["chatbots"], (chatbots) =>
        chatbots ? chatbots.filter((bot) => bot.slug !== chatbot.slug) : [],
      );
      toast({ title: "Chatbot deleted successfully!" });
      router.push("/");
    } catch (error) {
      setIsDeleting(false);
      toast({
        title: typeof error === "string" ? error : "Failed to delete chatbot!",
        variant: "destructive",
      });
    }
  }, [
    isDeleting,
    chatbotSlug,
    chatbot.slug,
    verifyText,
    queryClient,
    toast,
    router,
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Chatbot</DialogTitle>
          <DialogDescription>
            Warning: This will permanently delete your chatbot and their
            respective stats.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <fieldset className="grid gap-2">
            <Label htmlFor="verify">
              Enter the chatbot slug <strong>{chatbot.slug}</strong> to continue
            </Label>
            <Input
              value={chatbotSlug}
              onChange={(e) => setChatbotSlug(e.currentTarget.value)}
            />
          </fieldset>
          <fieldset className="grid gap-2">
            <Label htmlFor="verify">
              To verify, type <strong>{VERIFY_MESSAGE}</strong> below
            </Label>
            <Input
              value={verifyText}
              onChange={(e) => setVerifyText(e.currentTarget.value)}
            />
          </fieldset>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            disabled={
              isDeleting ||
              !(verifyText === VERIFY_MESSAGE && chatbotSlug === chatbot.slug)
            }
            onClick={handleDelete}
          >
            {isDeleting && (
              <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Chatbot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const useDeleteChatbotModal = () => {
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [open, setOpen] = useState(false);

  const showModal = useCallback((chatbot: Chatbot) => {
    setChatbot(chatbot);
    setOpen(true);
  }, []);

  const ModalCallback = useCallback(
    () =>
      chatbot ? (
        <DeleteChatbotModal
          open={open}
          onOpenChange={setOpen}
          chatbot={chatbot}
        />
      ) : null,
    [chatbot, open],
  );

  return useMemo(
    () => ({
      open,
      setOpen,
      showModal,
      Modal: ModalCallback,
    }),
    [ModalCallback, open, showModal],
  );
};
