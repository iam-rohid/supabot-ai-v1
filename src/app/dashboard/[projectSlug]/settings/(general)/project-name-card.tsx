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
import type { Project } from "@/lib/types/db-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateNameSchema = z.object({
  name: z
    .string({ required_error: "Project Name is required" })
    .min(1, "Project Name is required")
    .max(32),
});

type UpateNameFormData = z.infer<typeof updateNameSchema>;

export default function ProjectNameCard({
  projectName,
}: {
  projectName: string;
}) {
  const { projectSlug } = useParams() as { projectSlug: string };
  const form = useForm<UpateNameFormData>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: projectName || "",
    },
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = useCallback(
    async (data: UpateNameFormData) => {
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
        toast({ title: "Project name updated successfully!" });
      } catch (error) {
        toast({
          title:
            typeof error === "string"
              ? error
              : "Failed to update project name!",
          variant: "destructive",
        });
      }
    },
    [projectSlug, queryClient, toast],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Name</CardTitle>
        <CardDescription>
          This is the name of your project on {APP_NAME}
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
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Bot" {...field} />
                  </FormControl>
                  <FormDescription>Max 32 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
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
