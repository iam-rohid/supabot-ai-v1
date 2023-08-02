import {
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { porjectsTable } from "./projects";
import type { InferModel } from "drizzle-orm";

export const linkTrainingStatus = pgEnum("link_training_status", [
  "idle",
  "training",
  "trained",
  "failed",
]);

export const linksTable = pgTable(
  "links",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastTrainedAt: timestamp("last_trained_at"),
    url: varchar("url", { length: 255 }).notNull(),
    projectId: uuid("chatbot_id")
      .notNull()
      .references(() => porjectsTable.id, { onDelete: "cascade" }),
    metadata: jsonb("metadata").$type<Record<string, any>>(),
    trainingStatus: linkTrainingStatus("training_status")
      .default("idle")
      .notNull(),
  },
  (table) => {
    return {
      projectIdUrlKey: uniqueIndex().on(table.projectId, table.url),
    };
  },
);

export type LinkModel = InferModel<typeof linksTable>;
export type NewLinkModel = InferModel<typeof linksTable, "insert">;
