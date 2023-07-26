import { APP_DOMAIN } from "@/lib/constants";
import Link from "next/link";
import React from "react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Link href="/">Home</Link>
      <Link href="/pricing">Pricing</Link>

      <Link href={`${APP_DOMAIN}/login`}>Sign In</Link>
      <Link href={`${APP_DOMAIN}/register`}>Sign Up</Link>
      {children}
    </div>
  );
}
