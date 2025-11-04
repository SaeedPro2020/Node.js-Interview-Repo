import { Router } from 'express';
import { asyncHandler } from '../middleware/async.js';
import { createUser, getUserCached } from '../services/userService.js';


export const users = Router();


users.post('/', asyncHandler(async (req, res) => {
const { email, password, name } = req.body;
const user = await createUser(email, password, name);
res.status(201).json({ id: user.id, email: user.email, name: user.name });
}));


users.get('/:id', asyncHandler(async (req, res) => {
const user = await getUserCached(req.params.id);
if (!user) return res.status(404).json({ message: 'Not found' });
res.json(user);
}));