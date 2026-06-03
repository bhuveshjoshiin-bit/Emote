import express from 'express';
import { config } from './utils/config';
import { logger } from './utils/logger';
import { setupAPI } from './api';

const app = express();

// Setup API
setupAPI(app);

// Start server
const server = app.listen(config.port, () => {
  logger.info(`
╔════════════════════════════════════════╗
║   Multi-AI Agent Platform Started      ║
║                                        ║
║   Backend: http://localhost:${config.port}      ║
║   Environment: ${config.nodeEnv.toUpperCase()}
║   NIM Model: ${config.nvidia.model}
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
