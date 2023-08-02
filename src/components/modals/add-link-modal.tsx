import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { UseModalReturning } from "./types";
import { useForm } from "react-hook-form";
import {
  CreateLinkData,
  createLinkSchema,
} from "@/lib/validations/create-link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { DOMAIN } from "@/lib/constants";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import { useQueryClient } from "@tanstack/react-query";
import { LinkModel } from "@/lib/schema/links";
import { ApiResponse } from "@/lib/types";

const AddSingleLink = ({
  onOpenChange,
  projectSlug,
}: {
  onOpenChange: (value: boolean) => void;
  projectSlug: string;
}) => {
  const form = useForm<CreateLinkData>({
    resolver: zodResolver(createLinkSchema),
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = useCallback(
    async (data: CreateLinkData) => {
      try {
        const res = await fetch(`/api/chatbots/${projectSlug}/links`, {
          method: "POST",
          body: JSON.stringify({
            urls: [data.url],
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const resData: ApiResponse<LinkModel[]> = await res.json();
        if (!resData.success) {
          throw resData.error;
        }
        await queryClient.invalidateQueries(["links", projectSlug]);
        onOpenChange(false);
      } catch (error) {
        toast({
          title:
            typeof error === "string" ? error : "Failed to create project!",
          variant: "destructive",
        });
      }
    },
    [projectSlug, onOpenChange, queryClient, toast],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Url</FormLabel>
                <FormControl>
                  <Input placeholder={`https://${DOMAIN}`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="pt-6">
          <Button
            type="reset"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
            )}
            Add Link
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

const sitemapSchema = z.object({
  url: z.string().url(),
});

type SitemapFormData = z.infer<typeof sitemapSchema>;

const AddLinksFromSitemap = ({
  onOpenChange,
}: {
  onOpenChange: (value: boolean) => void;
}) => {
  const form = useForm<SitemapFormData>({
    resolver: zodResolver(sitemapSchema),
    defaultValues: {
      url: "",
    },
  });
  const [links, setLinks] = useState<string[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);

  const handleSubmit = useCallback(async (data: SitemapFormData) => {
    try {
      const res = await fetch("/api/sitemap-links", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
        },
      });
      const links = await res.json();
      setSelectedLinks([]);
      setLinks(links);
      console.log({ res, links });
    } catch (error) {
      console.log("faield to fetch links form sitemap", error);
    }
  }, []);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-4">
            <div className="flex items-end gap-6">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Sitemap Url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`https://${DOMAIN}/sitemap.xml`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={
                  !form.formState.isDirty || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
                )}
                Fetch Links
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <>
        {links.length ? (
          <>
            <ScrollArea className="relative h-[288px] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="sticky top-0">
                    <TableHead>
                      <Checkbox
                        checked={
                          links.length > 0 &&
                          selectedLinks.length === links.length
                        }
                        onCheckedChange={(value) => {
                          setSelectedLinks(value ? links : []);
                        }}
                      />
                    </TableHead>
                    <TableHead>Url</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => (
                    <TableRow key={link}>
                      <TableCell>
                        <Checkbox
                          checked={selectedLinks.includes(link)}
                          onCheckedChange={(value) => {
                            if (value) {
                              setSelectedLinks([...selectedLinks, link]);
                            } else {
                              setSelectedLinks(
                                selectedLinks.filter((slink) => slink !== link),
                              );
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{link}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-md border py-16 text-sm text-muted-foreground">
            Empty List
          </div>
        )}
      </>

      <DialogFooter className="pt-6">
        {selectedLinks.length > 0 && (
          <p className="flex-1 truncate text-sm text-muted-foreground">
            Selected {selectedLinks.length} links
          </p>
        )}
        <Button
          type="reset"
          variant="ghost"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button disabled={selectedLinks.length === 0}>Add Links</Button>
      </DialogFooter>
    </div>
  );
};

export function AddLinkModal({
  open,
  onOpenChange,
  projectSlug,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectSlug: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="url">
          <TabsList>
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          </TabsList>
          <TabsContent value="url">
            <AddSingleLink
              onOpenChange={onOpenChange}
              projectSlug={projectSlug}
            />
          </TabsContent>
          <TabsContent value="sitemap">
            <AddLinksFromSitemap onOpenChange={onOpenChange} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export const useAddLinkModal = ({
  projectSlug,
}: {
  projectSlug: string;
}): UseModalReturning => {
  const [open, setOpen] = useState(false);
  const Modal = useCallback(
    () => (
      <AddLinkModal
        open={open}
        onOpenChange={setOpen}
        projectSlug={projectSlug}
      />
    ),
    [projectSlug, open],
  );
  return [open, setOpen, Modal];
};
