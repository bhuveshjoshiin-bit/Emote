import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createRequestLogger, logger } from '../utils/logger';
import { config } from '../utils/config';
import { errorHandler } from './middleware/errorHandler';
import chatRoutes from './routes/chat';
import agentRoutes from './routes/agents';
import memoryRoutes from './routes/memory';

export function setupAPI(app: express.Application): void {
  // Middleware
  if (config.cors.enabled) {
    app.use(cors({ origin: config.cors.origin }));
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(createRequestLogger);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/chat', chatRoutes);
  app.use('/agents', agentRoutes);
  app.use('/memory', memoryRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  logger.info('API setup complete');
}
