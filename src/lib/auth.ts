import { AuthOptions, Session, getServerSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "./types";
import { Chatbot, ChatbotUserRole } from "@prisma/client";
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

export interface WithAuthHandler {
  (req: NextRequest, props: { session: Session }): any;
}

export const withAuth =
  (handler: WithAuthHandler) => async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
      } satisfies ApiResponse);
    }
    return handler(req, { session });
  };

export interface WithChatbotHandler {
  (
    req: NextRequest,
    props: { session: Session; chatbot: Chatbot; role: ChatbotUserRole },
  ): any;
}

export const withChatbot =
  (
    handler: WithChatbotHandler,
    {
      requireRoles,
    }: {
      requireRoles?: ChatbotUserRole[];
    } = {},
  ) =>
  async (req: NextRequest, ctx: { params: { slug: string } }) => {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
      } satisfies ApiResponse);
    }

    const chatbot = await prisma.chatbot.findUnique({
      where: {
        slug: ctx.params.slug,
      },
      select: {
        id: true,
        createdAt: true,
        name: true,
        description: true,
        slug: true,
        updatedAt: true,
        users: {
          where: {
            userId: session.user.id,
          },
          select: {
            role: true,
          },
        },
      },
    });

    if (!chatbot || chatbot.users.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Chatbot not found!",
      } satisfies ApiResponse);
    }

    if (
      requireRoles &&
      requireRoles.length > 0 &&
      !new Set(requireRoles).has(chatbot.users[0].role)
    ) {
      return NextResponse.json({
        success: false,
        error: "You don't have access!",
      } satisfies ApiResponse);
    }

    return handler(req, { chatbot, session, role: chatbot.users[0].role });
  };
