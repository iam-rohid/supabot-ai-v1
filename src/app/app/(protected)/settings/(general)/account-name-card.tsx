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
import type { User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(32),
});
type FormData = z.infer<typeof schema>;

export default function AccountNameCard({ session }: { session: Session }) {
  const { update } = useSession();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: session.user.name || undefined,
    },
  });
  const { toast } = useToast();

  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        const res = await fetch("/api/users", {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const resData: ApiResponse<User> = await res.json();
        if (!resData.success) {
          throw resData.error;
        }
        update();
        toast({ title: "Successfully updated your name!" });
      } catch (error) {
        toast({
          title:
            typeof error === "string" ? error : "Failed to update your name!",
          variant: "destructive",
        });
      }
    },
    [toast, update],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Name</CardTitle>
        <CardDescription>
          This will be your display name on {APP_NAME}
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
