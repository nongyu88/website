import { PrismaClient } from '@prisma/client'
import { PrismaMssql } from '@prisma/adapter-mssql'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Instantiate the SQL Server adapter using your environment variable
const adapter = new PrismaMssql(process.env.DATABASE_URL!)

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma