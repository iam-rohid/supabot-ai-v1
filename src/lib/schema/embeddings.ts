import {
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { linksTable } from "./links";
import { vector } from "pgvector/drizzle-orm";
import { OPENAI_EMBEDDING_DIMENSIONS } from "../constants";

export const embeddingsTable = pgTable("embeddings", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  linkId: uuid("link_id")
    .notNull()
    .references(() => linksTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  embedding: vector("embedding", {
    dimensions: OPENAI_EMBEDDING_DIMENSIONS,
  }).notNull(),
  tokenCount: smallint("token_count").notNull(),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
});
