import { logger } from '../utils/logger';
import { MemoryManager } from '../memory/MemoryManager';
import { NIMAdapter } from '../nim/NIMAdapter';
import { AgentBase } from './AgentBase';
import { PlannerAgent } from './PlannerAgent';
import { CoderAgent } from './CoderAgent';
import { ReviewerAgent } from './ReviewerAgent';
import { ToolAgent } from './ToolAgent';
import { ToDoDesignerAgent } from './ToDoDesignerAgent';

export interface AgentTask {
  id: string;
  description: string;
  assignedAgent?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export class AgentOrchestrator {
  private agents: Map<string, AgentBase> = new Map();
  private memory: MemoryManager;
  private nim: NIMAdapter;
  private taskQueue: AgentTask[] = [];

  constructor(memory?: MemoryManager, nim?: NIMAdapter) {
    this.memory = memory || new MemoryManager();
    this.nim = nim || new NIMAdapter();
    this.initializeAgents();
    logger.info('AgentOrchestrator initialized');
  }

  private initializeAgents(): void {
    this.agents.set('planner', new PlannerAgent(this.memory, this.nim));
    this.agents.set('coder', new CoderAgent(this.memory, this.nim));
    this.agents.set('reviewer', new ReviewerAgent(this.memory, this.nim));
    this.agents.set('tool', new ToolAgent(this.memory, this.nim));
    this.agents.set('todo', new ToDoDesignerAgent(this.memory, this.nim));
    logger.info('All agents initialized');
  }

  async executeTask(userRequest: string): Promise<any> {
    const taskId = require('uuid').v4();
    logger.info(`Starting orchestration for task: ${taskId}`);

    try {
      // Step 1: Plan the task
      const planner = this.agents.get('planner') as PlannerAgent;
      const plan = await planner.planTask(userRequest);
      logger.info(`Plan created: ${taskId}`);

      const results: any = {
        taskId,
        plan,
        execution: [],
      };

      // Step 2: Execute planned tasks
      for (const task of plan.tasks || []) {
        const agent = this.selectAgent(task);
        try {
          const result = await agent.execute(task.description);
          results.execution.push({
            taskId: task.id,
            status: 'completed',
            result,
          });
        } catch (error) {
          results.execution.push({
            taskId: task.id,
            status: 'failed',
            error: String(error),
          });
        }
      }

      // Step 3: Review results
      const reviewer = this.agents.get('reviewer') as ReviewerAgent;
      const review = await reviewer.validateOutput(results.execution, 'execution_results');
      results.review = review;

      await this.memory.saveTask(userRequest);
      logger.info(`Task completed: ${taskId}`);

      return results;
    } catch (error) {
      logger.error(`Task execution failed: ${taskId}`, error);
      throw error;
    }
  }

  private selectAgent(task: any): AgentBase {
    // Simple agent selection based on task characteristics
    const description = task.description?.toLowerCase() || '';

    if (description.includes('code') || description.includes('implement')) {
      return this.agents.get('coder') as AgentBase;
    } else if (description.includes('review') || description.includes('check')) {
      return this.agents.get('reviewer') as AgentBase;
    } else if (description.includes('schedule') || description.includes('plan')) {
      return this.agents.get('todo') as AgentBase;
    } else if (description.includes('tool') || description.includes('execute')) {
      return this.agents.get('tool') as AgentBase;
    }
    return this.agents.get('planner') as AgentBase;
  }

  getAgent(name: string): AgentBase | undefined {
    return this.agents.get(name);
  }

  getAllAgents(): Map<string, AgentBase> {
    return this.agents;
  }

  async chat(message: string): Promise<string> {
    this.memory.recordMessage('user', message);
    const result = await this.executeTask(message);
    const response = `Task processed. Plans: ${result.plan.tasks?.length || 0}, Executed: ${result.execution?.length || 0}`;
    this.memory.recordMessage('assistant', response);
    return response;
  }
}
