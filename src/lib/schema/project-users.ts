import {
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { porjectsTable } from "./projects";
import { usersTable } from "./users";
import type { InferModel } from "drizzle-orm";

export const projectUserRole = pgEnum("ChatbotUserRole", [
  "owner",
  "admin",
  "member",
]);

export const projectUsersTable = pgTable(
  "chatbot_users",
  {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    projectId: uuid("chatbot_id")
      .notNull()
      .references(() => porjectsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    role: projectUserRole("role").default("member").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.projectId, table.userId),
    };
  },
);

export type ProjectUser = InferModel<typeof projectUsersTable>;
export type NewProjectUser = InferModel<typeof projectUsersTable, "insert">;
