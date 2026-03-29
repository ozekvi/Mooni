// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");

declare global {
  // eslint-disable-next-line no-var
  var __prisma: InstanceType<typeof import("@prisma/client").PrismaClient> | undefined;
}

export const prisma: InstanceType<typeof import("@prisma/client").PrismaClient> =
  globalThis.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;
