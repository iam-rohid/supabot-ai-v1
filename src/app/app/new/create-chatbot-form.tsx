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
import { Label } from "@/components/ui/label";
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
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function CreateChatBotForm({
  organization,
  organizations,
}: {
  organizations: Organization[];
  organization: string;
}) {
  const form = useForm<CreateChatbotSchemaData>({
    resolver: zodResolver(createChatbotSchema),
  });
  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: CreateChatbotSchemaData) => {
      try {
        const res = await fetch(`/api/organizations/${organization}/chatbots`, {
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
        if (resData.id) {
          router.push(`/${organization}/${resData.id}`);
        }
      } catch (error) {
        console.error("Failed to create chatbot", error);
      }
    },
    [organization, router],
  );

  // useEffect(() => {
  //   const org = organizations.find((org) => org.id === organizationId);
  //   if (org && org.id !== organization.id) {
  //     console.log("ORG UPDATED");
  //     const params = new URLSearchParams({ org: org.slug });
  //     router.push(`/new?${params.toString()}`);
  //   }
  // }, [organization.id, organizationId, organizations, router]);

  const handleOrgChange = useCallback(
    (org: string) => {
      const params = new URLSearchParams({ org });
      router.push(`/new?${params.toString()}`);
    },
    [router],
  );

  return (
    <Form {...form}>
      <form className="grid gap-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex gap-6">
          <fieldset className="grid gap-2">
            <Label htmlFor="organization">Organization</Label>
            <Select value={organization} onValueChange={handleOrgChange}>
              <SelectTrigger id="organization" className="w-[180px]">
                <SelectValue placeholder="Select a organization" />
              </SelectTrigger>
              <SelectContent align="start" side="bottom">
                {organizations.map((item) => (
                  <SelectItem key={item.slug} value={item.slug}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </fieldset>

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
