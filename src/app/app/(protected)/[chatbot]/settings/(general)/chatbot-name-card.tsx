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

const updateNameSchema = z.object({
  name: z
    .string({ required_error: "Chatbot Name is required" })
    .min(1, "Chatbot Name is required")
    .max(32),
});

type UpateNameFormData = z.infer<typeof updateNameSchema>;

export default function ChatbotNameCard() {
  const form = useForm<UpateNameFormData>({
    resolver: zodResolver(updateNameSchema),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chatbot Name</CardTitle>
        <CardDescription>
          This is the name of your chatbot on {APP_NAME}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form>
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
