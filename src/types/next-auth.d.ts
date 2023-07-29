import NextAuth, { DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
    } & DefaultSession["user"];
  }
  interface User {
    role: "admin" | "user" | null | undefined;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: User | null;
    image?: string | null;
  }
}
