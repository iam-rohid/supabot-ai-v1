"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCallback } from "react";
import { CreateOrgData, createOrgSchema } from "@/lib/validations/create-org";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateOrgForm() {
  const form = useForm<CreateOrgData>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });
  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: CreateOrgData) => {
      try {
        const res = await fetch("/api/organizations", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const resData = (await res.json()) as { slug: string };
        if (!res.ok) {
          throw resData;
        }
        console.log({ resData });
        router.push(`/${resData.slug}`);
      } catch (error) {
        console.log("Failed to create org", error);
      }
    },
    [router],
  );

  return (
    <Card className="mx-auto my-32 max-w-md">
      <CardHeader>
        <CardTitle>Create organization</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Org" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="my-org" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {form.formState.isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <span>Create Organization</span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
