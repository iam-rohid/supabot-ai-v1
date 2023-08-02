import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import SignInForm from "./signin-form";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Sign in to ${APP_NAME}`,
};

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen flex-col justify-center py-16">
      <div className="mx-auto grid w-full max-w-md gap-6 px-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to {APP_NAME}
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to sign in to your account
          </p>
        </div>

        <Suspense>
          <SignInForm />
        </Suspense>

        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
