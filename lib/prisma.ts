import { PrismaClient } from '@prisma/client';
import { PrismaMssql } from '@prisma/adapter-mssql';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString =
  process.env.DATABASE_URL ||
  'sqlserver://database-1.cafgq2amw3z4.us-east-1.rds.amazonaws.com:1433;database=kraftgene_db;user=admin;password=Sh19571854675;encrypt=true;trustServerCertificate=true';

const adapter = new PrismaMssql(connectionString);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;