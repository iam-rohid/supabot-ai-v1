import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cache } from "react";

export const getSession = cache(() => getServerSession(authOptions));
