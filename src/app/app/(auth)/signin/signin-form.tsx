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
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
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
    <div className="grid gap-4">
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
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
            {form.formState.isSubmitting ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Continue with Email
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <p className="text-sm text-muted-foreground">OR</p>
        <div className="h-px flex-1 bg-border" />
      </div>

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
        {oauthSingInOpen ? (
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GithubIcon className="mr-2 text-xl" />
        )}
        Sign in with Github
      </Button>
    </div>
  );
}
