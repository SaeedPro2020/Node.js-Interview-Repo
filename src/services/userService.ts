import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

let redis: Redis | undefined;
function getRedis() {
  if (!process.env.REDIS_URL) return undefined;
  if (!redis) redis = new Redis(process.env.REDIS_URL);
  return redis;
}

export async function createUser(email: string, password: string, name?: string) {
  const hash = await bcrypt.hash(password, 10);
  return prisma.user.create({ data: { email, password: hash, name } });
}

export async function getUserCached(id: string) {
  const key = `user:${id}`;
  const r = getRedis();
  if (r) {
    const cached = await r.get(key);
    if (cached) return JSON.parse(cached);
  }
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true } });
  if (user && r) await r.setex(key, 60, JSON.stringify(user));
  return user;
}

export async function disconnect() {
  await prisma.$disconnect();
  if (redis) await redis.quit();
}
