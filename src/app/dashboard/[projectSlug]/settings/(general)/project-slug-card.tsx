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
import { Project } from "@/lib/schema/projects";
import type { ApiResponse } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateSlugSchema = z.object({
  slug: z
    .string({ required_error: "Project slug is required" })
    .min(1, "Project slug is required")
    .max(32),
});

type UpdateSlugFormData = z.infer<typeof updateSlugSchema>;

export default function ProjectSlugCard() {
  const { projectSlug } = useParams() as { projectSlug: string };
  const form = useForm<UpdateSlugFormData>({
    resolver: zodResolver(updateSlugSchema),
    defaultValues: { slug: projectSlug },
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: UpdateSlugFormData) => {
      try {
        const res = await fetch(`/api/projects/${projectSlug}`, {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const resData: ApiResponse<Project> = await res.json();
        if (!resData.success) {
          throw resData.error;
        }
        queryClient.setQueryData<Project[]>(
          ["projects"],
          (projects) =>
            projects?.map((bot) =>
              bot.slug === resData.data.slug ? resData.data : bot,
            ),
        );
        queryClient.setQueryData<Project>(
          ["project", resData.data.slug],
          resData.data,
        );
        router.push(`/dashboard/${data.slug}/settings`);
        toast({ title: "Project slug updated successfully!" });
      } catch (error) {
        toast({
          title:
            typeof error === "string"
              ? error
              : "Failed to update project slug!",
          variant: "destructive",
        });
      }
    },
    [projectSlug, queryClient, router, toast],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Slug</CardTitle>
        <CardDescription>
          This is your project&apos;s unique slug on {APP_NAME}
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
                  <FormLabel>Project Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="my-bot" {...field} />
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
