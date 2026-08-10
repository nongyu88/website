import { PrismaClient } from '@prisma/client';
import { PrismaMssql } from '@prisma/adapter-mssql';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Provide a valid dummy SQL Server connection string during build time
const connectionString =
  process.env.DATABASE_URL ||
  'sqlserver://localhost:1433;database=dummy;user=sa;password=dummy;trustServerCertificate=true;';

const adapter = new PrismaMssql(connectionString);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;