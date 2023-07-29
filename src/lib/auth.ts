import { type AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { sendEmail } from "./emails";
import LoginLink from "../../emails/login-email";
import { APP_NAME } from "./constants";
import { db } from "./drizzle";
import { usersTable } from "./schema/users";
import { eq } from "drizzle-orm";
import { drizzleAdapter } from "./drizzle-adapter";

export const authOptions: AuthOptions = {
  adapter: drizzleAdapter,
  providers: [
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url }) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`Login link: ${url}`);
          return;
        }
        await sendEmail({
          email: identifier,
          subject: `Your ${APP_NAME} Login Link`,
          react: LoginLink({ url, email: identifier }),
        });
      },
    }),
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
  ],
  pages: {
    error: "/signin",
    signIn: "/signin",
    verifyRequest: "/signin",
  },
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user, trigger }) => {
      if (!token.email) {
        return {};
      }
      if (user) {
        token.user = user;
      }
      if (trigger === "update" && token.sub) {
        const [refreshedUser] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, token.sub));
        token.user = refreshedUser;
        token.email = refreshedUser?.email;
        token.name = refreshedUser?.name;
        token.image = refreshedUser?.image;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        ...token.user,
        ...session.user,
      };
      return session;
    },
    signIn: async ({ user, profile, account }) => {
      if (!user.email) {
        return false;
      }
      if (account?.provider === "github") {
        const [userExist] = await db
          .select({ name: usersTable.name })
          .from(usersTable)
          .where(eq(usersTable.email, user.email));
        if (userExist && !userExist.name && profile?.name) {
          await db
            .update(usersTable)
            .set({
              name: profile.name,
            })
            .where(eq(usersTable.email, user.email));
        }
      }
      return true;
    },
  },
  events: {
    signIn: async ({ user, isNewUser }) => {
      if (isNewUser) {
        console.log("NEW USER CREATED", user);
      }
    },
  },
};
