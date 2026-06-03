import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AgentOrchestrator } from '../../agents/AgentOrchestrator';
import { MemoryManager } from '../../memory/MemoryManager';
import { logger } from '../../utils/logger';

const router = Router();
const memory = new MemoryManager();
const orchestrator = new AgentOrchestrator(memory);

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    logger.info(`Chat request: ${message}`);
    memory.recordMessage('user', message);

    const result = await orchestrator.chat(message);

    res.json({
      success: true,
      message: result,
      memory: memory.getMemoryStats(),
    });
  })
);

router.post(
  '/stream',
  asyncHandler(async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    memory.recordMessage('user', message);

    try {
      const result = await orchestrator.chat(message);
      res.write(`data: ${JSON.stringify({ type: 'message', content: result })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'complete' })}\n\n`);
    } catch (error) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: String(error) })}\n\n`);
    }

    res.end();
  })
);

export default router;
