import { PrismaClient } from '@prisma/client';

const prisma = 
// global.__prisma || 
new PrismaClient();

// if (process.env.NODE_ENV !== 'production') global.__prisma = prisma;

export { prisma };