import { Router, Request, Response } from 'express';
import { memoryManager } from '../memory/MemoryManager';
import { logger } from '../utils/logger';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const memory = memoryManager.exportMemory();
    res.json(memory);
  } catch (error) {
    logger.error({ error }, 'Memory retrieval error');
    res.status(500).json({ error: 'Failed to retrieve memory' });
  }
});

router.get('/recent', (req: Request, res: Response) => {
  try {
    const count = parseInt(req.query.count as string) || 20;
    const memory = memoryManager.getRecentMemory(count);
    res.json(memory);
  } catch (error) {
    logger.error({ error }, 'Recent memory retrieval error');
    res.status(500).json({ error: 'Failed to retrieve recent memory' });
  }
});

router.get('/agent/:agentId', (req: Request, res: Response) => {
  try {
    const memory = memoryManager.getAgentMemory(req.params.agentId);
    res.json(memory);
  } catch (error) {
    logger.error({ error }, 'Agent memory retrieval error');
    res.status(500).json({ error: 'Failed to retrieve agent memory' });
  }
});

router.post('/clear/short', (req: Request, res: Response) => {
  try {
    memoryManager.clearShortTerm();
    res.json({ message: 'Short-term memory cleared' });
  } catch (error) {
    logger.error({ error }, 'Clear short-term memory error');
    res.status(500).json({ error: 'Failed to clear memory' });
  }
});

router.post('/clear/all', (req: Request, res: Response) => {
  try {
    memoryManager.clearAll();
    res.json({ message: 'All memory cleared' });
  } catch (error) {
    logger.error({ error }, 'Clear all memory error');
    res.status(500).json({ error: 'Failed to clear memory' });
  }
});

export default router;
