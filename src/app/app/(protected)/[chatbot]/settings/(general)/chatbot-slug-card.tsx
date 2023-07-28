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
import { APP_NAME } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateSlugSchema = z.object({
  slug: z
    .string({ required_error: "Chatbot slug is required" })
    .min(1, "Chatbot slug is required")
    .max(32),
});

type UpdateSlugFormData = z.infer<typeof updateSlugSchema>;

export default function ChatbotSlugCard() {
  const form = useForm<UpdateSlugFormData>({
    resolver: zodResolver(updateSlugSchema),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chatbot Slug</CardTitle>
        <CardDescription>
          This is your chatbot&apos;s unique slug on {APP_NAME}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form>
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
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
