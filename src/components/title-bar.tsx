export type TitleBarProps = {
  title: string;
  children?: React.ReactNode;
};

export default function TitleBar({ title, children }: TitleBarProps) {
  return (
    <header className="border-b bg-card text-card-foreground">
      <div className="container py-4 flex items-center min-h-[8rem]">
        <h2 className="text-2xl font-semibold flex-1 truncate">{title}</h2>
        {children}
      </div>
    </header>
  );
}
