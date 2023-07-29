import { type AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { sendEmail } from "./emails";
import LoginLink from "../../emails/login-email";
import { APP_NAME } from "./constants";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
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
      if (trigger === "update") {
        const refreshedUser = await prisma.user.findUnique({
          where: {
            id: token.sub,
          },
        });
        token.user = refreshedUser;
        token.email = refreshedUser?.email;
        token.name = refreshedUser?.name;
        token.image = refreshedUser?.image;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        id: token.sub,
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
        const userExist = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
          select: {
            name: true,
          },
        });
        if (userExist && !userExist.name && profile?.name) {
          await prisma.user.update({
            where: {
              email: user.email,
            },
            data: {
              name: profile.name,
            },
          });
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
