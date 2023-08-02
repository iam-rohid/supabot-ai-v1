import { Skeleton } from "./ui/skeleton";

export type TitleBarProps = {
  title: string;
  children?: React.ReactNode;
};

export default function PageHeader({ title, children }: TitleBarProps) {
  return (
    <header className="border-b bg-card text-card-foreground">
      <div className="container flex min-h-[8rem] items-center py-4">
        <h2 className="flex-1 truncate text-2xl font-semibold">{title}</h2>
        {children}
      </div>
    </header>
  );
}

export function PageHeaderSkeleton() {
  return (
    <header className="border-b bg-card text-card-foreground">
      <div className="container flex min-h-[8rem] items-center py-4">
        <Skeleton className="h-8 w-32" />
        <div className="flex-1"></div>
        <Skeleton className="h-10 w-32" />
      </div>
    </header>
  );
}
