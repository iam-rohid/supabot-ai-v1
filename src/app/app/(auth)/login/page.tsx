import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import LogInForm from "./login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Sign in to ${APP_NAME}`,
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to {APP_NAME}</CardTitle>
          <CardDescription>
            Start making chatbots for your site with ChatGPT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LogInForm />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Button variant="link" asChild className="p-0">
              <Link href="/register">Sign Up</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
