import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
console.log(process.env.DATABASE_URL);
const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});

export default prisma;