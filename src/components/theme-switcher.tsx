"use client";

import { CheckIcon, Computer, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  if (!domLoaded) {
    return <Skeleton className="h-10 w-10" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {theme === "light" ? (
            <Sun size={20} />
          ) : theme === "dark" ? (
            <Moon size={20} />
          ) : (
            <Computer size={20} />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <CheckIcon
            size={20}
            className={cn("mr-2 opacity-0", {
              "opacity-100": theme === "light",
            })}
          />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <CheckIcon
            size={20}
            className={cn("mr-2 opacity-0", {
              "opacity-100": theme === "dark",
            })}
          />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <CheckIcon
            size={20}
            className={cn("mr-2 opacity-0", {
              "opacity-100": theme === "system",
            })}
          />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
