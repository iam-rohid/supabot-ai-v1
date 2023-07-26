import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { sendEmail } from "./emails";

export const authOptions: AuthOptions = {
  providers: [
    // EmailProvider({
    //   sendVerificationRequest({ identifier, url }) {
    //     console.log(`Login link: ${url}`);
    //     // if (process.env.NODE_ENV === "development") {
    //     //   return;
    //     // } else {
    //     //   sendEmail({
    //     //     email: identifier,
    //     //     subject: "Your Dub Login Link",
    //     //     react: LoginLink({ url, email: identifier }),
    //     //   });
    //     // }
    //   },
    // }),
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
  ],
  pages: {
    error: "/login",
    signIn: "/login",
    verifyRequest: "/login",
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
  },
};
