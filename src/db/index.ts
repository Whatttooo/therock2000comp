import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from "@neondatabase/serverless";
import * as schema from "@/db/schema";

if (!process.env.DATABASE_URL) {
  console.error("[db]", {
    scope: "db-init",
    message: "DATABASE_URL is not set",
    vercelEnv: process.env.VERCEL_ENV,
    vercelRegion: process.env.VERCEL_REGION,
  });
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(process.env.DATABASE_URL);

const globalForDb = globalThis as unknown as { conn: typeof sql | undefined };
const conn = globalForDb.conn ?? sql;
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle({ client: conn, schema });
