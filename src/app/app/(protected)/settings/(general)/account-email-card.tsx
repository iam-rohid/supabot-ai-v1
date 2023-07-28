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
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .max(32),
});

type FormData = z.infer<typeof schema>;

const emailUpdateFn = async (data: FormData) => {
  const res = await fetch("/api/users", {
    method: "PUT",
    body: JSON.stringify({ email: data.email }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const body: ApiResponse<User> = await res.json();
  if (!body.success) {
    throw body.error;
  }
  return body.data;
};

export default function AccountEmailCard({ email }: { email: string }) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email,
    },
  });
  const { update } = useSession();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationKey: ["update-account-email"],
    mutationFn: emailUpdateFn,
    onMutate: () => {
      toast({ title: "Updating your email..." });
    },
    onSuccess() {
      update();
      toast({ title: "Successfully updated your email!" });
    },
    onError(error) {
      toast({
        title:
          typeof error === "string" ? error : "Failed to update your email!",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = useCallback(
    async (data: FormData) => {
      await mutation.mutateAsync(data);
    },
    [mutation],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Email</CardTitle>
        <CardDescription>
          This will be the email you use to log in to {APP_NAME} and receive
          notifications.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Must be a valid email address.
                  </FormDescription>
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
