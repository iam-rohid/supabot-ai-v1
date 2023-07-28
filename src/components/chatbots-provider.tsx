"use client";

import { Chatbot } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useForm } from "react-hook-form";
import {
  CreateChatbotSchemaData,
  createChatbotSchema,
} from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

export type ChatbotsContextType = {
  chatbots: Chatbot[];
  currentChatbot?: Chatbot | null;
  isLoading?: boolean;
  createChatbot: () => void;
  setCurrentChatbotSlug: (slug: string | null) => void;
};

export const ChatbotsContext = createContext<ChatbotsContextType | null>(null);

export default function ChatbotsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data } = useSession();
  const [chatbotModalOpen, setChatbotModalOpen] = useState(false);
  const [currentChatbotSlug, setCurrentChatbotSlug] = useState<string | null>(
    null,
  );
  const { toast } = useToast();
  const chatbotsQuery = useQuery<Chatbot[]>({
    queryKey: ["chatbots", data?.user.id],
    queryFn: async () => {
      const res = await fetch("/api/chatbots");
      const chatbots = await res.json();
      if (!res.ok) {
        throw res.statusText;
      }
      return chatbots;
    },
  });
  const router = useRouter();
  const queryClient = useQueryClient();
  const createChatbotMutation = useMutation({
    mutationKey: ["create-chatbot", data?.user.id],
    mutationFn: async (data: CreateChatbotSchemaData) => {
      const res = await fetch("/api/chatbots", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const chatbot = await res.json();
      if (!res.ok) {
        throw res.statusText;
      }
      return chatbot as Chatbot;
    },
    onSuccess(data, variables) {
      console.log("CHATBOT CREATION SUCCESS", data, variables);
      toast({ title: "Chatbot created" });
      setChatbotModalOpen(false);
      queryClient.invalidateQueries(["chatbots"]);
      router.push(`/${data.slug}`);
    },
    onError(error, variables) {
      console.log("CHATBOT CREATION FAILED", error, variables);
      toast({ title: "Failed to create chatbot", variant: "destructive" });
    },
    onMutate(variables) {
      console.log("CHATBOT CREATION STARTED", variables);
      toast({ title: "Creating chabot" });
    },
  });

  const chatbots = useMemo(
    () => chatbotsQuery.data || [],
    [chatbotsQuery.data],
  );

  const currentChatbot = useMemo(
    () =>
      currentChatbotSlug
        ? chatbots.find((chatbot) => chatbot.slug === currentChatbotSlug)
        : null,
    [chatbots, currentChatbotSlug],
  );

  const createChatbot = useCallback(() => {
    setChatbotModalOpen(true);
  }, []);

  return (
    <ChatbotsContext.Provider
      value={{
        chatbots,
        createChatbot,
        isLoading: chatbotsQuery.isLoading,
        setCurrentChatbotSlug,
        currentChatbot,
      }}
    >
      {children}
      <Dialog open={chatbotModalOpen} onOpenChange={setChatbotModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Chatbot</DialogTitle>
          </DialogHeader>
          <CreateChatbotForm
            handleCreate={createChatbotMutation.mutateAsync}
            onClose={() => setChatbotModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </ChatbotsContext.Provider>
  );
}

export const useChatbots = () => {
  const context = useContext(ChatbotsContext);
  if (!context) {
    throw "useChatbots must use inside a ChatbotProvider";
  }
  return context;
};

const CreateChatbotForm = ({
  handleCreate,
  onClose,
}: {
  handleCreate: (data: CreateChatbotSchemaData) => Promise<Chatbot>;
  onClose: () => void;
}) => {
  const form = useForm<CreateChatbotSchemaData>({
    resolver: zodResolver(createChatbotSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreate)} className="grid gap-6">
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

        <div className="flex items-center justify-end gap-4">
          <Button
            disabled={form.formState.isSubmitting}
            type="reset"
            onClick={onClose}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>Create Chatbot</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
