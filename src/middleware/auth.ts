import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config.js';


declare global {
namespace Express { interface Request { user?: { sub: string; role?: string } } }
}


export function auth(required = true) {
return (req: Request, res: Response, next: NextFunction) => {
const header = req.headers.authorization;
if (!header) return required ? res.status(401).json({ message: 'Missing token' }) : next();


const token = header.replace('Bearer ', '');
try {
const payload = jwt.verify(token, env.JWT_SECRET) as any;
req.user = { sub: payload.sub, role: payload.role };
next();
} catch {
return res.status(401).json({ message: 'Invalid token' });
}
};
}