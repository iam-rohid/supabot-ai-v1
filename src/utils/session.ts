import "server-only";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cache } from "react";

export const revalidate = 3600;

export const getSession = cache(async () => {
  console.log("getSession");
  const session = await getServerSession(authOptions);
  return session;
});
