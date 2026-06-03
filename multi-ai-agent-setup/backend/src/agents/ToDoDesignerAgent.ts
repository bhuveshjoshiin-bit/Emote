import { AgentBase, AgentConfig } from './AgentBase';
import { MemoryManager } from '../memory/MemoryManager';
import { NIMAdapter } from '../nim/NIMAdapter';

export class ToDoDesignerAgent extends AgentBase {
  constructor(memory: MemoryManager, nim: NIMAdapter) {
    const config: AgentConfig = {
      name: 'ToDoDesigner',
      role: 'Task Scheduling & Organization',
      description: 'Creates structured task lists and schedules',
      systemPrompt: `You are an expert task organizer and productivity specialist. Your role is to:
1. Convert objectives into detailed to-do lists
2. Organize tasks by priority and timeline
3. Create actionable checklists
4. Estimate time requirements
5. Suggest scheduling and deadlines
6. Provide motivation and milestone markers

Return structured task lists in JSON:
{
  "title": "string",
  "description": "string",
  "tasks": [{
    "id": "string",
    "title": "string",
    "description": "string",
    "priority": "high/medium/low",
    "estimatedTime": "number (minutes)",
    "dueDate": "ISO string",
    "subtasks": []
  }],
  "totalEstimatedTime": "number (minutes)",
  "milestones": []
}`,
      capabilities: [
        'task_organization',
        'priority_management',
        'timeline_creation',
        'goal_breakdown',
      ],
    };
    super(config, memory, nim);
  }

  async designTodoList(objective: string, timeframe?: string): Promise<any> {
    const prompt = timeframe
      ? `Create a detailed to-do list for: "${objective}" with a timeframe of ${timeframe}`
      : `Create a detailed to-do list for: "${objective}"`;

    const response = await this.think(prompt);
    try {
      return JSON.parse(response);
    } catch {
      return {
        title: objective,
        description: response,
        tasks: [],
        milestones: [],
      };
    }
  }

  async createSchedule(tasks: any[], deadline: Date): Promise<any> {
    return this.think(
      `Create an optimized schedule for these tasks to be completed by ${deadline.toISOString()}: ${JSON.stringify(tasks)}`
    );
  }
}
