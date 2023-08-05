import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { accountsTable } from "./schema/accounts";
import { sessionsTable } from "./schema/sessions";
import { usersTable } from "./schema/users";
import { verificationTokensTable } from "./schema/verification-tokens";

export const drizzleAdapter: NextAuthOptions["adapter"] = {
  createUser: async (args) => {
    const [data] = await db.insert(usersTable).values(args).returning();
    console.log("createUser", {
      data,
      args,
    });
    return data;
  },
  getUser: async (userId) => {
    const [data] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));
    console.log("getUser", {
      data,
      args: { userId },
    });
    return data;
  },
  getUserByEmail: async (email) => {
    const [data] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    console.log("getUserByEmail", {
      data,
      args: { email },
    });
    return data;
  },
  updateUser: async (args) => {
    const { id, ...restArgs } = args;
    const [data] = await db
      .update(usersTable)
      .set({
        ...restArgs,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, id))
      .returning();
    console.log("updateUser", {
      data,
      args,
    });
    return data;
  },
  deleteUser: async (userId) => {
    const [data] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, userId))
      .returning();
    console.log("deleteUser", {
      data,
      args: { userId },
    });
    return data;
  },
  createSession: async (args) => {
    const [data] = await db.insert(sessionsTable).values(args).returning();
    console.log("createSession", {
      data,
      args,
    });
    return data;
  },
  updateSession: async (args) => {
    const { sessionToken, ...restArgs } = args;
    const [data] = await db
      .update(sessionsTable)
      .set(restArgs)
      .where(eq(sessionsTable.sessionToken, sessionToken))
      .returning();
    console.log("updateSession", {
      data,
      args,
    });
    return data;
  },
  deleteSession: async (sessionToken) => {
    const [data] = await db
      .delete(sessionsTable)
      .where(eq(sessionsTable.sessionToken, sessionToken))
      .returning();
    console.log("deleteSession", {
      data,
      args: { sessionToken },
    });
    return data;
  },
  getSessionAndUser: async (sessionToken) => {
    const [data] = await db
      .select()
      .from(sessionsTable)
      .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
      .where(eq(sessionsTable.sessionToken, sessionToken));
    console.log("getSessionAndUser", {
      data,
      args: { sessionToken },
    });
    return {
      session: data.sessions,
      user: data.users,
    };
  },
  linkAccount: async (args) => {
    const [data] = await db
      .insert(accountsTable)
      .values({
        accessToken: args.access_token,
        expiresAt: args.expires_at,
        idToken: args.id_token,
        provider: args.provider,
        providerAccountId: args.providerAccountId,
        refreshToken: args.refresh_token,
        scope: args.scope,
        sessionState: args.session_state,
        tokenType: args.token_type,
        type: args.type,
        userId: args.userId,
      })
      .returning();
    console.log("linkAccount", {
      data,
      args,
    });
    return {
      access_token: data.accessToken || undefined,
      expires_at: data.expiresAt || undefined,
      id_token: data.idToken || undefined,
      provider: data.provider,
      providerAccountId: data.providerAccountId,
      refresh_token: data.refreshToken || undefined,
      scope: data.scope || undefined,
      session_state: data.sessionState || undefined,
      token_type: data.tokenType || undefined,
      type: data.type,
      userId: data.userId,
    };
  },
  getUserByAccount: async (args) => {
    const [data] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        emailVerified: usersTable.emailVerified,
        role: usersTable.role,
        image: usersTable.image,
      })
      .from(accountsTable)
      .innerJoin(usersTable, eq(usersTable.id, accountsTable.userId))
      .where(
        and(
          eq(accountsTable.provider, args.provider),
          eq(accountsTable.providerAccountId, args.providerAccountId),
        ),
      );
    console.log("getUserByAccount", {
      data,
      args,
    });
    return data;
  },
  unlinkAccount: async (args) => {
    const [data] = await db
      .delete(accountsTable)
      .where(
        and(
          eq(accountsTable.provider, args.provider),
          eq(accountsTable.providerAccountId, args.providerAccountId),
        ),
      )
      .returning();

    console.log("unlinkAccount", {
      data,
      args,
    });

    return {
      access_token: data.accessToken ?? undefined,
      expires_at: data.expiresAt ?? undefined,
      id_token: data.idToken ?? undefined,
      provider: data.provider,
      providerAccountId: data.providerAccountId,
      refresh_token: data.refreshToken ?? undefined,
      scope: data.scope ?? undefined,
      session_state: data.sessionState ?? undefined,
      token_type: data.tokenType ?? undefined,
      type: data.type,
      userId: data.userId,
    };
  },
  createVerificationToken: async (args) => {
    const [data] = await db
      .insert(verificationTokensTable)
      .values(args)
      .returning();
    console.log("createVerificationToken", {
      data,
      args,
    });
    return data;
  },
  useVerificationToken: async (args) => {
    const [data] = await db
      .delete(verificationTokensTable)
      .where(
        and(
          eq(verificationTokensTable.identifier, args.identifier),
          eq(verificationTokensTable.token, args.token),
        ),
      )
      .returning();
    console.log("useVerificationToken", {
      data,
      args,
    });
    return data;
  },
};
