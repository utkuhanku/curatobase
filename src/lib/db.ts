import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Lazy initialization key
const prismaClientSingleton = () => {
  // Only init if DB URL is present or if we are not in build phase context issues
  // Actually, Vercel build phase might import this but NOT use it if we are careful.
  // But if we instantiate new PrismaClient() it might try to connect or validate env.
  if (!process.env.DATABASE_URL) {
    // Return a proxy or throw? 
    // Better: allow instantiation but it will fail on connect if used.
    // Prisma 5 usually doesn't crash on init unless datasources are invalid.
    // But let's be safe: If no URL, return undefined or similar? No, type safety.
    console.warn("⚠️ DATABASE_URL missing. Prisma Client initialized in limited mode (will fail on queries).");
  }
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  })
}

export const prisma =
  globalForPrisma.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
