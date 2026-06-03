import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { MemoryManager } from '../../memory/MemoryManager';

const router = Router();
const memory = new MemoryManager();

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const stats = memory.getMemoryStats();
    const recent = memory.getRecentMemory(10);

    res.json({
      success: true,
      stats,
      recent,
    });
  })
);

router.get(
  '/history',
  asyncHandler(async (req: Request, res: Response) => {
    const conversations = await memory.getConversationHistory();
    const tasks = await memory.getTaskHistory();

    res.json({
      success: true,
      conversations: conversations.length,
      tasks: tasks.length,
      data: {
        conversations,
        tasks,
      },
    });
  })
);

router.get(
  '/export',
  asyncHandler(async (req: Request, res: Response) => {
    const exported = await memory.exportMemory();
    res.json({
      success: true,
      data: exported,
    });
  })
);

router.delete(
  '/clear/short-term',
  asyncHandler(async (req: Request, res: Response) => {
    memory.clearShortTerm();
    res.json({
      success: true,
      message: 'Short-term memory cleared',
    });
  })
);

router.delete(
  '/clear/long-term',
  asyncHandler(async (req: Request, res: Response) => {
    await memory.clearLongTerm();
    res.json({
      success: true,
      message: 'Long-term memory cleared',
    });
  })
);

export default router;
