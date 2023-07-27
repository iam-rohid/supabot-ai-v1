"use client";

import GithubIcon from "@/components/icons/github";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { APP_NAME } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email(),
});
type SchemaData = z.infer<typeof schema>;

export default function SignInForm() {
  const form = useForm<SchemaData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });
  const [oauthSingInOpen, setOauthSingInOpen] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(() => searchParams.get("next"), [searchParams]);
  const { toast } = useToast();
  const isLoading = useMemo(
    () => form.formState.isSubmitting || oauthSingInOpen,
    [form.formState.isSubmitting, oauthSingInOpen],
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const handleSubmit = useCallback(
    async ({ email }: SchemaData) => {
      try {
        const res = await signIn("email", {
          email,
          redirect: false,
          ...(callbackUrl && callbackUrl.length > 0 ? { callbackUrl } : {}),
        });
        if (res?.error) {
          throw res?.error;
        }
        toast({
          title: "Email sent - check your inbox!",
        });
        form.reset();
      } catch (error) {
        toast({
          title: "Failed to send email!",
          variant: "destructive",
        });
      }
    },
    [callbackUrl, form, toast],
  );

  return (
    <div className="mx-auto w-full max-w-md p-6">
      <div className="mb-6 h-12 w-12 rounded-full bg-primary" />
      <h1 className="mb-8 text-2xl font-semibold">Sign in to {APP_NAME}</h1>
      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && (
              <Loader2Icon size={20} className="mr-2 animate-spin" />
            )}
            Continue with Email
          </Button>
        </form>
      </Form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <p className="text-sm text-muted-foreground">OR</p>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setOauthSingInOpen(true);
            signIn("github", {
              ...(callbackUrl && callbackUrl.length > 0 ? { callbackUrl } : {}),
            });
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2Icon size={20} className="mr-2 animate-spin" />
          ) : (
            <GithubIcon className="mr-2 text-2xl" />
          )}
          Sign in with Github
        </Button>
      </div>
    </div>
  );
}
