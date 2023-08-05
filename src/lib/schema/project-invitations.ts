import {
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { projectUserRole } from "./project-users";
import { projectsTable } from "./projects";

export const projectInvitationsTable = pgTable(
  "project_invitations",
  {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projectsTable.id, { onDelete: "cascade" }),
    expires: timestamp("expires").notNull(),
    role: projectUserRole("role").default("member").notNull(),
  },
  (table) => ({
    pk: primaryKey(table.projectId, table.email),
  }),
);
