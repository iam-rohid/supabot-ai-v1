"use client";

import GithubIcon from "@/components/icons/github";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2Icon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export default function LogInForm() {
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(() => searchParams.get("next"), [searchParams]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await signIn("email", {
        email,
        redirect: false,
        ...(callbackUrl && callbackUrl.length > 0 ? { callbackUrl } : {}),
      });
      console.log("SIGN IN SUCCESS", res);
    } catch (error) {
      console.log("Failed to signin with email", error);
    }
  }, [callbackUrl, email]);

  return (
    <div>
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <fieldset className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </fieldset>
        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading && <Loader2Icon size={20} className="mr-2 animate-spin" />}
          Continue with Email
        </Button>
      </form>
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-muted" />
        <p className="text-sm text-muted-foreground/50">OR</p>
        <div className="flex-1 h-px bg-muted" />
      </div>
      <div className="flex flex-col gap-3">
        {/* <Button variant="outline" className="w-full">
          <GoogleIcon className="text-2xl mr-2" />
          Sign in with Github
        </Button> */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            signIn("github", {
              ...(callbackUrl && callbackUrl.length > 0 ? { callbackUrl } : {}),
            });
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2Icon size={20} className="mr-2 animate-spin" />
          ) : (
            <GithubIcon className="text-2xl mr-2" />
          )}
          Sign in with Github
        </Button>
      </div>
    </div>
  );
}
