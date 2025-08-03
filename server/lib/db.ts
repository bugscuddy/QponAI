import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient();

// Optional: Add middleware or other database configurations here
