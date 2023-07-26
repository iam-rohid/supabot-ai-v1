import { APP_DOMAIN, APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: `Welcome to ${APP_NAME}`,
};

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
