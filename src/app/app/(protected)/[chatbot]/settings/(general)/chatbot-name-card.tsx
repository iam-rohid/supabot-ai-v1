"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { APP_NAME } from "@/lib/constants";
import { ApiResponse } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chatbot } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateNameSchema = z.object({
  name: z
    .string({ required_error: "Chatbot Name is required" })
    .min(1, "Chatbot Name is required")
    .max(32),
});

type UpateNameFormData = z.infer<typeof updateNameSchema>;

export default function ChatbotNameCard({ chatbot }: { chatbot: Chatbot }) {
  const form = useForm<UpateNameFormData>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: chatbot.name,
    },
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = useCallback(
    async (data: UpateNameFormData) => {
      try {
        const res = await fetch(`/api/chatbots/${chatbot.slug}`, {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const resData: ApiResponse<Chatbot> = await res.json();
        if (!resData.success) {
          throw resData.error;
        }
        queryClient.setQueryData<Chatbot[]>(
          ["chatbots"],
          (chatbots) =>
            chatbots?.map((bot) =>
              bot.slug === resData.data.slug ? resData.data : bot,
            ),
        );
        queryClient.setQueryData<Chatbot>(
          ["chatbot", resData.data.slug],
          resData.data,
        );
        toast({ title: "Chatbot name updated successfully!" });
      } catch (error) {
        toast({
          title:
            typeof error === "string"
              ? error
              : "Failed to update chatbot name!",
          variant: "destructive",
        });
      }
    },
    [chatbot.slug, queryClient, toast],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chatbot Name</CardTitle>
        <CardDescription>
          This is the name of your chatbot on {APP_NAME}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chatbot Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Chatbot" {...field} />
                  </FormControl>
                  <FormDescription>Max 32 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
