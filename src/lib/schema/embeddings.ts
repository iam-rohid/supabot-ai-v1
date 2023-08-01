import {
  customType,
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { linksTable } from "./links";
import type { InferModel } from "drizzle-orm";

const vector = customType<{
  data: number[];
  config: {
    dimensions: number;
  };
}>({
  dataType: (config) => {
    const dimensions = config?.dimensions || 3;
    return `vector(${dimensions})`;
  },
  toDriver(value) {
    return JSON.stringify(value);
  },
});

export const embeddingsTable = pgTable("embeddings", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  linkId: uuid("link_id")
    .notNull()
    .references(() => linksTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  tokenCount: smallint("token_count").notNull(),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
});

export type EmbeddingRow = InferModel<typeof embeddingsTable>;
export type NewEmbeddingRow = InferModel<typeof embeddingsTable, "insert">;
