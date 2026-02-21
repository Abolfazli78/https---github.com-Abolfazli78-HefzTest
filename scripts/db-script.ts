/**
 * Prisma client for standalone scripts (no server-only).
 */
import "dotenv/config";
import { PrismaClient } from "@/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
  query_timeout: 30000,
});

const adapter = new PrismaPg(pool);
export const db = new PrismaClient({
  adapter,
  log: ["error"],
});
