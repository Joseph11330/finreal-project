import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient instance across hot reloads in dev so we don't
// exhaust the Postgres connection pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Lazy singleton PrismaClient. Created on first property access rather than at
 * import time, so the module can be safely imported in MOCK_API mode without a
 * valid database connection or generated Prisma client.
 */
let _prisma: PrismaClient | undefined;

function getOrCreatePrisma(): PrismaClient {
  if (!_prisma) {
    _prisma = globalForPrisma.prisma ?? new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = _prisma;
  }
  return _prisma;
}

// Proxy keeps the existing `import { prisma } from "@/lib/prisma"` API intact
// while deferring PrismaClient creation until first property access.
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return (getOrCreatePrisma() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
