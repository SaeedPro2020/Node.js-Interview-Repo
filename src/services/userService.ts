import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();
const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : undefined;


export async function createUser(email: string, password: string, name?: string) {
const hash = await bcrypt.hash(password, 10);
return prisma.user.create({ data: { email, password: hash, name } });
}


export async function getUserCached(id: string) {
const key = `user:${id}`;
if (redis) {
const cached = await redis.get(key);
if (cached) return JSON.parse(cached);
}
const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true } });
if (user && redis) await redis.setex(key, 60, JSON.stringify(user));
return user;
}


export async function disconnect() {
await prisma.$disconnect();
await redis?.quit();
}