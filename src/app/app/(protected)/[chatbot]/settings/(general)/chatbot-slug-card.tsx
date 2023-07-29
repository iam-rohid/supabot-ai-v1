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
import type { ApiResponse } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Chatbot } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateSlugSchema = z.object({
  slug: z
    .string({ required_error: "Chatbot slug is required" })
    .min(1, "Chatbot slug is required")
    .max(32),
});

type UpdateSlugFormData = z.infer<typeof updateSlugSchema>;

export default function ChatbotSlugCard({ chatbot }: { chatbot: Chatbot }) {
  const form = useForm<UpdateSlugFormData>({
    resolver: zodResolver(updateSlugSchema),
    defaultValues: { slug: chatbot.slug },
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: UpdateSlugFormData) => {
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
        router.push(`/${data.slug}/settings`);
        toast({ title: "Chatbot slug updated successfully!" });
      } catch (error) {
        toast({
          title:
            typeof error === "string"
              ? error
              : "Failed to update chatbot slug!",
          variant: "destructive",
        });
      }
    },
    [chatbot.slug, queryClient, router, toast],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chatbot Slug</CardTitle>
        <CardDescription>
          This is your chatbot&apos;s unique slug on {APP_NAME}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chatbot Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="my-chatbot" {...field} />
                  </FormControl>
                  <FormDescription>Max 32 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
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
