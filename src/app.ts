import express from 'express';
import pinoHttp from 'pino-http';
import { errorHandler } from './middleware/error.js';
import { health } from './routes/health.js';
import { users } from './routes/users.js';


export const createApp = () => {
const app = express();
app.use(express.json());
app.use(pinoHttp());
app.use(health);
app.use('/users', users);
app.use(errorHandler);
return app;
};