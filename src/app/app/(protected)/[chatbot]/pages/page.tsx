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
import { db } from "@/lib/drizzle";
import { chatbotsTable } from "@/lib/schema/chatbots";
import { pagesTable } from "@/lib/schema/pages";
import { formatDistanceToNow } from "date-fns";
import { eq } from "drizzle-orm";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default async function PagesPage({
  params,
}: {
  params: { chatbot: string };
}) {
  const pages = await db
    .select({
      id: pagesTable.id,
      lastTrainedAt: pagesTable.lastTrainedAt,
      url: pagesTable.url,
      trainingStatus: pagesTable.trainingStatus,
    })
    .from(pagesTable)
    .innerJoin(chatbotsTable, eq(chatbotsTable.id, pagesTable.chatbotId))
    .where(eq(chatbotsTable.slug, params.chatbot));

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
                  <TableCell>{page.trainingStatus.toUpperCase()}</TableCell>
                  <TableCell>
                    {page.lastTrainedAt
                      ? formatDistanceToNow(new Date(page.lastTrainedAt))
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
