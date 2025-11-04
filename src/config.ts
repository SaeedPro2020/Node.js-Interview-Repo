import 'dotenv/config';
import { z } from 'zod';


const EnvSchema = z.object({
NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
PORT: z.string().default('3000'),
DATABASE_URL: z.string(),
REDIS_URL: z.string().optional(),
JWT_SECRET: z.string().min(16),
});


export const env = EnvSchema.parse(process.env);