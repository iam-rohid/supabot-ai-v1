"use client";

import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { LinkModel } from "@/lib/schema/links";
import { ApiResponse } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function LinksList() {
  const { project_slug } = useParams() as { project_slug: string };
  const linksQuery = useQuery({
    queryKey: ["links", project_slug],
    queryFn: async () => {
      const res = await fetch(`/api/chatbots/${project_slug}/links`);
      const data: ApiResponse<LinkModel[]> = await res.json();
      if (!data.success) {
        throw data.error;
      }
      return data.data;
    },
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const retrainLink = useCallback(
    async (link: LinkModel) => {
      try {
        queryClient.setQueryData<LinkModel[]>(
          ["links", project_slug],
          (links) =>
            links?.map((oldLink) =>
              oldLink.id === link.id
                ? { ...oldLink, trainingStatus: "training" }
                : oldLink,
            ),
        );
        const res = await fetch(
          `/api/chatbots/${project_slug}/links/${link.id}/retrain`,
          {
            method: "POST",
          },
        );
        const data: ApiResponse<LinkModel> = await res.json();
        if (!data.success) {
          throw data.error;
        }
        toast({ title: data.message || "Link retrain success" });
        queryClient.setQueryData<LinkModel[]>(
          ["links", project_slug],
          (links) =>
            links?.map((oldLink) =>
              oldLink.id === link.id ? { ...oldLink, ...data.data } : oldLink,
            ),
        );
      } catch (error) {
        queryClient.setQueryData<LinkModel[]>(
          ["links", project_slug],
          (links) =>
            links?.map((oldLink) =>
              oldLink.id === link.id
                ? { ...oldLink, trainingStatus: "failed" }
                : oldLink,
            ),
        );
        toast({
          title: typeof error === "string" ? error : "Failed to retrain link",
          variant: "destructive",
        });
      }
    },
    [project_slug, queryClient, toast],
  );

  const deleteLink = useCallback(
    async (link: LinkModel) => {
      try {
        queryClient.setQueryData<LinkModel[]>(
          ["links", project_slug],
          (links) => links?.filter((oldLink) => oldLink.id !== link.id),
        );
        const res = await fetch(
          `/api/chatbots/${project_slug}/links/${link.id}`,
          {
            method: "DELETE",
          },
        );
        const data: ApiResponse<LinkModel> = await res.json();
        if (!data.success) {
          throw data.error;
        }
        toast({ title: data.message || "Link delete success" });
      } catch (error) {
        queryClient.invalidateQueries(["links", project_slug]);
        toast({
          title: typeof error === "string" ? error : "Failed to delete link",
          variant: "destructive",
        });
      }
    },
    [project_slug, queryClient, toast],
  );

  if (linksQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (linksQuery.isError) {
    return <p>Error loading links</p>;
  }

  return (
    <>
      {linksQuery.data.length > 0 ? (
        <div className="rounded-lg border">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>LAST TRAINED ON</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linksQuery.data.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>{link.url}</TableCell>
                  <TableCell>{link.trainingStatus.toUpperCase()}</TableCell>
                  <TableCell>
                    {link.lastTrainedAt
                      ? formatDistanceToNow(new Date(link.lastTrainedAt), {
                          addSuffix: true,
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <Link href={link.url} target="_blank">
                            Visit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => retrainLink(link)}>
                          Retrain
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteLink(link)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <>No Links Found</>
      )}
    </>
  );
}
