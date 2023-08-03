import PageHeader from "@/components/page-header";
import AddLinkButton from "./add-link-button";
import { Suspense } from "react";
import { getLinksByProjectSlug } from "@/utils/links";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default async function LinksPage({
  params,
}: {
  params: { projectSlug: string };
}) {
  return (
    <>
      <PageHeader title="Links">
        <AddLinkButton />
      </PageHeader>

      <main className="container py-8">
        <Suspense fallback={<LinksListLoadingSkeletion />}>
          <LinksList projectSlug={params.projectSlug} />
        </Suspense>
      </main>
    </>
  );
}

function LinksListLoadingSkeletion() {
  return (
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
          {new Array(3).fill(1).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-6 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-36" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-10 w-10" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

async function LinksList({ projectSlug }: { projectSlug: string }) {
  const links = await getLinksByProjectSlug(projectSlug);

  if (links.length === 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>You haven&apos;t added any links yet!</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Image
            src="/assets/empty-artwork.svg"
            width={512}
            height={512}
            className="max-h-64 w-full object-contain"
            alt="Empty Artwork"
          />
        </CardContent>
        <CardFooter className="justify-center">
          <AddLinkButton label="Add a Link" />
        </CardFooter>
      </Card>
    );
  }

  return (
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
          {links.map((link) => (
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
                    <DropdownMenuItem>Retrain</DropdownMenuItem>
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
  );
}
