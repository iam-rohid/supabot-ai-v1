import { APP_NAME, HOME_DOMAIN } from "@/lib/constants";
import { Metadata } from "next";
import SignInForm from "./signin-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";

export const metadata: Metadata = {
  title: `Sign in to ${APP_NAME}`,
};

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen flex-col justify-center py-16">
      <div className="fixed left-0 right-0 top-0">
        <div className="container flex h-16 items-center">
          <Button variant="ghost" asChild>
            <Link href={HOME_DOMAIN}>
              <ChevronLeftIcon size={20} className="-ml-1 mr-2" />
              Home
            </Link>
          </Button>
        </div>
      </div>
      <SignInForm />
    </div>
  );
}
