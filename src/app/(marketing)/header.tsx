import NavLink from "@/components/nav-link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_NAME, HOME_DOMAIN } from "@/lib/constants";
import { getSession } from "@/utils/session";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function Header() {
  return (
    <>
      <header className="bg-card text-card-foreground">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex-1">
            <Link
              href={HOME_DOMAIN}
              className="text-xl font-bold text-accent-foreground"
            >
              {APP_NAME}
            </Link>
          </div>
          <nav className="flex items-center gap-8 max-md:hidden">
            <NavLink
              className="text-sm font-medium"
              inactiveClassName="text-muted-foreground hover:text-accent-foreground"
              activeClassName="text-accent-foreground"
              href="/about"
            >
              About
            </NavLink>
            <NavLink
              className="text-sm font-medium"
              inactiveClassName="text-muted-foreground hover:text-accent-foreground"
              activeClassName="text-accent-foreground"
              href="/blog"
            >
              Blog
            </NavLink>
            <NavLink
              className="text-sm font-medium"
              inactiveClassName="text-muted-foreground hover:text-accent-foreground"
              activeClassName="text-accent-foreground"
              href="/pricing"
            >
              Pricing
            </NavLink>
          </nav>
          <div className="flex flex-1 items-center justify-end">
            <Suspense fallback={<Skeleton className="h-10 w-32" />}>
              <AuthButtonGroup />
            </Suspense>
          </div>
        </div>
      </header>
    </>
  );
}

async function AuthButtonGroup() {
  const session = await getSession();

  if (session) {
    return (
      <Button asChild>
        <Link href="/dashboard">
          Dashboard
          <ChevronRight className="-mr-1 ml-2 h-4 w-4" />
        </Link>
      </Button>
    );
  }

  return (
    <div className="space-x-2">
      <Button variant="ghost" asChild>
        <Link href="/signin">Sign In</Link>
      </Button>
      <Button>
        <Link
          href={{
            pathname: "/signin",
            query: new URLSearchParams({
              next: "/pricing",
            }).toString(),
          }}
        >
          Get Started
        </Link>
      </Button>
    </div>
  );
}
