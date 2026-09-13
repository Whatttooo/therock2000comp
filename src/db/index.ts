import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from "@neondatabase/serverless";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL!);

const globalForDb = globalThis as unknown as { conn: typeof sql | undefined };
const conn = globalForDb.conn ?? sql;
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle({ client: conn, schema });
