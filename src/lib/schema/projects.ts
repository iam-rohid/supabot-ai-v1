import type { InferModel } from "drizzle-orm";
import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const porjectsTable = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    name: varchar("name", { length: 32 }).notNull(),
    slug: varchar("slug", { length: 32 }).notNull(),
    description: varchar("description", { length: 300 }),
  },
  (table) => {
    return {
      slugKey: uniqueIndex().on(table.slug),
      nameIdx: index().on(table.name),
    };
  },
);

export type Project = InferModel<typeof porjectsTable>;
export type NewProject = InferModel<typeof porjectsTable, "insert">;
