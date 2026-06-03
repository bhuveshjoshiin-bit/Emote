import { AgentBase, AgentConfig } from './AgentBase';
import { MemoryManager } from '../memory/MemoryManager';
import { NIMAdapter } from '../nim/NIMAdapter';

export class PlannerAgent extends AgentBase {
  constructor(memory: MemoryManager, nim: NIMAdapter) {
    const config: AgentConfig = {
      name: 'Planner',
      role: 'Task Decomposition & Planning',
      description: 'Breaks down complex tasks into actionable steps',
      systemPrompt: `You are an expert task planner. Your role is to:
1. Analyze user requests and break them into clear, actionable steps
2. Identify dependencies between tasks
3. Estimate effort and priority for each task
4. Create structured execution plans
5. Return plans in JSON format with tasks array

Always respond with a structured JSON plan containing:
{
  "tasks": [{"id": "string", "description": "string", "priority": "high/medium/low", "dependencies": []}],
  "summary": "string",
  "estimatedTime": "string"
}`,
      capabilities: [
        'task_decomposition',
        'dependency_analysis',
        'priority_assessment',
        'timeline_estimation',
      ],
    };
    super(config, memory, nim);
  }

  async planTask(userRequest: string): Promise<any> {
    const response = await this.think(
      `Please create a detailed execution plan for: ${userRequest}`
    );
    try {
      return JSON.parse(response);
    } catch {
      return {
        tasks: [{ id: '1', description: response, priority: 'medium' }],
        summary: response,
      };
    }
  }
}
