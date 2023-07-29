import {
  customType,
  jsonb,
  pgTable,
  smallint,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { pagesTable } from "./pages";
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

export const pageSectionsTable = pgTable("page_sections", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  pageId: uuid("page_id")
    .notNull()
    .references(() => pagesTable.id, { onDelete: "cascade" }),
  content: varchar("content", { length: 2000 }).notNull(),
  embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  tokenCount: smallint("token_count").notNull(),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
});

export type PageSection = InferModel<typeof pageSectionsTable>;
export type NewPageSection = InferModel<typeof pageSectionsTable, "insert">;
