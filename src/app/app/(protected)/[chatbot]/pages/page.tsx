import TitleBar from "@/components/title-bar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default async function PagesPage({
  params,
}: {
  params: { chatbot: string };
}) {
  const pages = await prisma.page.findMany({
    where: {
      chatbot: {
        slug: params.chatbot,
      },
    },
  });
  return (
    <>
      <TitleBar title="Pages">
        <Button>Add New Page</Button>
      </TitleBar>

      <div className="main container py-8">
        <div className="rounded-lg border">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>PAGE URL</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>LAST TRAINED ON</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>{page.url}</TableCell>
                  <TableCell>Trained</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(page.updatedAt))}
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
                          <Link href={page.url} target="_blank">
                            Visit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={page.url} target="_blank">
                            Retrain
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
