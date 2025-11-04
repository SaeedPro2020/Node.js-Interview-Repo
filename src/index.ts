import { createServer } from 'http';
import { createApp } from './app.js';
import { setupGraceful } from './utils/graceful.js';
import { env } from './config.js';
import { disconnect } from './services/userService.js';


const app = createApp();
const server = createServer(app);


server.listen(Number(env.PORT), () => console.log(`API on :${env.PORT}`));
setupGraceful(server, async () => { await disconnect(); });