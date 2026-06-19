import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/** Changes when generated models change — busts stale dev singletons. */
const CLIENT_FINGERPRINT = JSON.stringify({
  Card: Prisma.CardScalarFieldEnum,
  User: Prisma.UserScalarFieldEnum,
});

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
  prismaFingerprint?: string;
};

function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });
}

function getPrismaClient() {
  const cached = globalForPrisma.prisma;

  if (
    cached &&
    globalForPrisma.prismaFingerprint === CLIENT_FINGERPRINT &&
    typeof cached.card?.create === "function" &&
    typeof cached.user?.upsert === "function"
  ) {
    return cached;
  }

  const client = createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
    globalForPrisma.prismaFingerprint = CLIENT_FINGERPRINT;
  }

  return client;
}

export const prisma = getPrismaClient();
