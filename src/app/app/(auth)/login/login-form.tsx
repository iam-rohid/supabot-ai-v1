"use client";

import GithubIcon from "@/components/icons/github";
import GoogleIcon from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export default function LogInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(() => searchParams.get("next"), [searchParams]);

  return (
    <div>
      <form className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
          />
        </fieldset>
        <Button className="w-full">Continue with Email</Button>
      </form>
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-muted" />
        <p className="text-sm text-muted-foreground/50">OR</p>
        <div className="flex-1 h-px bg-muted" />
      </div>
      <div className="flex flex-col gap-3">
        <Button variant="outline" className="w-full">
          <GoogleIcon className="text-2xl mr-2" />
          Sign in with Github
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            signIn("github", {
              ...(callbackUrl && callbackUrl.length > 0 ? { callbackUrl } : {}),
            });
          }}
        >
          <GithubIcon className="text-2xl mr-2" />
          Sign in with Github
        </Button>
      </div>
    </div>
  );
}
