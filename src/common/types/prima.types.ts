import { PrismaClient, Prisma } from '@prisma/client';

export type PrismaExecutor = PrismaClient | Prisma.TransactionClient;