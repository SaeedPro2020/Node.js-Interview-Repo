import { Server } from 'http';
import { logger } from '../logger.js';


export function setupGraceful(server: Server, cleanup: () => Promise<void> | void) {
const shutdown = async (signal: string) => {
logger.info({ signal }, 'Shutting down...');
server.close(async () => {
try { await cleanup(); } catch (e) { logger.error(e, 'Cleanup failed'); }
process.exit(0);
});
setTimeout(() => process.exit(1), 10_000).unref();
};
['SIGINT', 'SIGTERM'].forEach(s => process.on(s as NodeJS.Signals, () => shutdown(s)));
}