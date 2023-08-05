import {
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { ProviderType } from "next-auth/providers/index";

export const accountsTable = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 80 }).$type<ProviderType>().notNull(),
    provider: varchar("provider", { length: 80 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 80 }).notNull(),
    refreshToken: varchar("refresh_token", { length: 255 }),
    accessToken: varchar("access_token", { length: 255 }),
    expiresAt: integer("expires_at"),
    tokenType: varchar("token_type", { length: 80 }),
    scope: varchar("scope", { length: 80 }),
    idToken: varchar("id_token", { length: 255 }),
    sessionState: varchar("session_state", { length: 80 }),
  },
  (table) => {
    return {
      providerProviderAccountIdKey: uniqueIndex().on(
        table.provider,
        table.providerAccountId,
      ),
    };
  },
);
