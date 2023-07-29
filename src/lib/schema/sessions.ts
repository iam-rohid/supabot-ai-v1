import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import type { InferModel } from "drizzle-orm";

export const sessionsTable = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    sessionToken: varchar("session_token", { length: 255 }).notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    expires: timestamp("expires").notNull(),
  },
  (table) => {
    return {
      sessionTokenKey: uniqueIndex().on(table.sessionToken),
    };
  },
);

export type Session = InferModel<typeof sessionsTable>;
export type NewSession = InferModel<typeof sessionsTable, "insert">;
