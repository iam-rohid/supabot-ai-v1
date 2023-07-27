"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateChatbotSchemaData,
  createChatbotSchema,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Organization } from "@prisma/client";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function CreateChatBotForm({
  organization,
  organizations,
}: {
  organizations: Organization[];
  organization: Organization;
}) {
  const form = useForm<CreateChatbotSchemaData>({
    resolver: zodResolver(createChatbotSchema),
    defaultValues: {
      organizationId: organization.id,
    },
  });
  const router = useRouter();
  const currentOrgId = form.watch("organizationId");

  const handleSubmit = useCallback(async (data: CreateChatbotSchemaData) => {
    try {
      const res = await fetch("/api/chatbots", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await res.json();
      if (!res.ok) {
        throw res.statusText;
      }
      console.log("SUCCESS", resData);
    } catch (error) {
      console.error("Failed to create chatbot", error);
    }
  }, []);

  useEffect(() => {
    const org = organizations.find((org) => org.id === currentOrgId);
    if (org && org.id !== organization.id) {
      console.log("ORG UPDATED");
      const params = new URLSearchParams({ org: org.slug });
      router.push(`/new?${params.toString()}`);
    }
  }, [currentOrgId, organization.id, organizations, router]);

  return (
    <Form {...form}>
      <form className="grid gap-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="organizationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a organization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent align="start" side="bottom">
                    {organizations.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Chatbot" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about your chatbot"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end">
          <Button disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Create Chatbot
                <ArrowRightIcon className="-mr-1 ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
