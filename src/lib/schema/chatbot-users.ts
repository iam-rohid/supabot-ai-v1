import {
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { chatbotsTable } from "./chatbots";
import { usersTable } from "./users";
import type { InferModel } from "drizzle-orm";

export const chatbotUserRole = pgEnum("ChatbotUserRole", [
  "owner",
  "admin",
  "member",
]);

export const chatbotUsersTable = pgTable(
  "chatbot_users",
  {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    chatbotId: uuid("chatbot_id")
      .notNull()
      .references(() => chatbotsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    role: chatbotUserRole("role").default("member").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.chatbotId, table.userId),
    };
  },
);

export type ChatbotUser = InferModel<typeof chatbotUsersTable>;
export type NewChatbotUser = InferModel<typeof chatbotUsersTable, "insert">;
