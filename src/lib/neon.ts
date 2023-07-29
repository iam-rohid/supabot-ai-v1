import { neon } from "@neondatabase/serverless";

export const neonDb = neon(process.env.DATABASE_URL!);
