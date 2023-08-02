import { NextAuthOptions } from "next-auth";
import { db } from "./drizzle";
import { eq, and } from "drizzle-orm";
import { accountsTable } from "./schema/accounts";
import { sessionsTable } from "./schema/sessions";
import { usersTable } from "./schema/users";
import { verificationTokensTable } from "./schema/verification-tokens";

export const drizzleAdapter: NextAuthOptions["adapter"] = {
  createUser: async (data) => {
    const [user] = await db.insert(usersTable).values(data).returning();
    return user;
  },
  getUser: async (userId) => {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));
    return user;
  },
  getUserByEmail: async (email) => {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return user;
  },
  updateUser: async ({ id, ...data }) => {
    const [user] = await db
      .update(usersTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, id))
      .returning();
    return user;
  },
  deleteUser: async (userId) => {
    const [user] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, userId))
      .returning();
    return user;
  },
  createSession: async (data) => {
    const [session] = await db.insert(sessionsTable).values(data).returning();
    return session;
  },
  updateSession: async ({ sessionToken, ...data }) => {
    const [session] = await db
      .update(sessionsTable)
      .set(data)
      .where(eq(sessionsTable.sessionToken, sessionToken))
      .returning();
    return session;
  },
  deleteSession: async (sessionToken) => {
    const [session] = await db
      .delete(sessionsTable)
      .where(eq(sessionsTable.sessionToken, sessionToken))
      .returning();
    return session;
  },
  getSessionAndUser: async (sessionToken: string) => {
    const [sessionAndUser] = await db
      .select()
      .from(sessionsTable)
      .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
      .where(eq(sessionsTable.sessionToken, sessionToken));
    return {
      session: sessionAndUser.sessions,
      user: sessionAndUser.users,
    };
  },
  linkAccount: async (data) => {
    const [account] = await db
      .insert(accountsTable)
      .values({
        accessToken: data.access_token,
        expiresAt: data.expires_at,
        idToken: data.id_token,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        refreshToken: data.refresh_token,
        scope: data.scope,
        sessionState: data.session_state,
        tokenType: data.token_type,
        type: data.type,
        userId: data.userId,
      })
      .returning();
    if (!account) {
      throw "Failed to link account";
    }
    return {
      access_token: account.accessToken || undefined,
      expires_at: account.expiresAt || undefined,
      id_token: account.idToken || undefined,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      refresh_token: account.refreshToken || undefined,
      scope: account.scope || undefined,
      session_state: account.sessionState || undefined,
      token_type: account.tokenType || undefined,
      type: account.type,
      userId: account.userId,
    };
  },
  getUserByAccount: async ({ provider, providerAccountId }) => {
    const [user] = await db
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
          eq(accountsTable.provider, provider),
          eq(accountsTable.providerAccountId, providerAccountId),
        ),
      );
    return user || null;
  },
  unlinkAccount: async ({ provider, providerAccountId }) => {
    const [account] = await db
      .delete(accountsTable)
      .where(
        and(
          eq(accountsTable.provider, provider),
          eq(accountsTable.providerAccountId, providerAccountId),
        ),
      )
      .returning();

    if (!account) {
      throw "Failed to unlink account";
    }

    return {
      access_token: account.accessToken || undefined,
      expires_at: account.expiresAt || undefined,
      id_token: account.idToken || undefined,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      refresh_token: account.refreshToken || undefined,
      scope: account.scope || undefined,
      session_state: account.sessionState || undefined,
      token_type: account.tokenType || undefined,
      type: account.type,
      userId: account.userId,
    };
  },
  createVerificationToken: async (data) => {
    const [token] = await db
      .insert(verificationTokensTable)
      .values(data)
      .returning();
    return token;
  },
  useVerificationToken: async ({ identifier, token }) => {
    const [verificationToken] = await db
      .delete(verificationTokensTable)
      .where(
        and(
          eq(verificationTokensTable.identifier, identifier),
          eq(verificationTokensTable.token, token),
        ),
      )
      .returning();
    return verificationToken;
  },
};
