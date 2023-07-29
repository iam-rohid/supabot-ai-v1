import type { InferModel } from "drizzle-orm";
import {
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const verificationTokensTable = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 64 }).notNull(),
    expires: timestamp("expires").notNull(),
  },
  (table) => {
    return {
      identifierTokenKey: primaryKey(table.identifier, table.token),
      tokenKey: uniqueIndex().on(table.token),
    };
  },
);

export type VerificationToken = InferModel<typeof verificationTokensTable>;
export type NewVerificationToken = InferModel<
  typeof verificationTokensTable,
  "insert"
>;
