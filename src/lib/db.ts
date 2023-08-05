// import "server-only";
import { type NeonQueryFunction, neon } from "@neondatabase/serverless";
import { type NeonHttpDatabase, drizzle } from "drizzle-orm/neon-http";

declare global {
  var sql: NeonQueryFunction<false, false> | undefined;
  var db: NeonHttpDatabase<Record<string, never>> | undefined;
}

const sql = global.sql || neon(process.env.DATABASE_URL!);
const db = global.db || drizzle(sql);

if (process.env.NODE_ENV === "development") {
  global.db = db;
  global.sql = sql;
}

export { db, sql };
