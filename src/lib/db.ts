import { PrismaClient } from "@prisma/client";

// Standard Next.js dev-mode singleton — without this, every hot-reload of
// a file that imports `db` creates a brand new PrismaClient (and a new
// connection pool) on top of the last one, quickly exhausting the
// database's connection limit.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
