import type { InferModel } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["admin", "user"]);

export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    name: varchar("name", { length: 80 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("email_verified"),
    image: text("image"),
    role: userRole("role").default("user"),
  },
  (table) => ({
    emailKey: uniqueIndex().on(table.email),
  }),
);

export type User = InferModel<typeof usersTable>;
export type NewUser = InferModel<typeof usersTable, "insert">;
