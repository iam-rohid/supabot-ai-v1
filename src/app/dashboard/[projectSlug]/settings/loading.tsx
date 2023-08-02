import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid gap-8">
      <Skeleton className="h-[300px]"></Skeleton>
      <Skeleton className="h-[300px]"></Skeleton>
      <Skeleton className="h-[300px]"></Skeleton>
    </div>
  );
}
