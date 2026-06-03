import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AgentOrchestrator } from '../../agents/AgentOrchestrator';
import { logger } from '../../utils/logger';

const router = Router();
const orchestrator = new AgentOrchestrator();

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const agents = orchestrator.getAllAgents();
    const agentList = Array.from(agents.entries()).map(([name, agent]) => ({
      name,
      role: agent.getRole(),
      capabilities: agent.getCapabilities(),
      id: agent.getId(),
    }));

    res.json({
      success: true,
      agents: agentList,
      count: agentList.length,
    });
  })
);

router.post(
  '/run',
  asyncHandler(async (req: Request, res: Response) => {
    const { agentName, task, params } = req.body;

    if (!agentName || !task) {
      return res.status(400).json({
        success: false,
        error: 'agentName and task are required',
      });
    }

    const agent = orchestrator.getAgent(agentName);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: `Agent not found: ${agentName}`,
      });
    }

    logger.info(`Running agent: ${agentName}, task: ${task}`);
    const result = await agent.execute(task, params);

    res.json({
      success: true,
      agent: agentName,
      result,
    });
  })
);

router.get(
  '/:agentName',
  asyncHandler(async (req: Request, res: Response) => {
    const { agentName } = req.params;
    const agent = orchestrator.getAgent(agentName);

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: `Agent not found: ${agentName}`,
      });
    }

    res.json({
      success: true,
      agent: {
        name: agent.getName(),
        role: agent.getRole(),
        capabilities: agent.getCapabilities(),
        id: agent.getId(),
      },
    });
  })
);

export default router;
