import { AgentBase, AgentConfig } from './AgentBase';
import { MemoryManager } from '../memory/MemoryManager';
import { NIMAdapter } from '../nim/NIMAdapter';

export class ToolAgent extends AgentBase {
  private tools: Map<string, Function> = new Map();

  constructor(memory: MemoryManager, nim: NIMAdapter) {
    const config: AgentConfig = {
      name: 'ToolAgent',
      role: 'Tool Execution & Integration',
      description: 'Manages and executes available tools',
      systemPrompt: `You are a tool orchestration expert. Your role is to:
1. Understand tool requirements and parameters
2. Execute appropriate tools based on tasks
3. Handle tool responses and errors
4. Combine multiple tools when needed
5. Report execution results

When using tools, specify them in JSON:
{
  "tool": "tool_name",
  "parameters": {"key": "value"},
  "description": "what this tool does"
}`,
      capabilities: [
        'tool_selection',
        'tool_execution',
        'parameter_validation',
        'error_handling',
      ],
    };
    super(config, memory, nim);
    this.initializeDefaultTools();
  }

  private initializeDefaultTools(): void {
    this.registerTool('math', (operation: string, ...args: number[]) => {
      switch (operation) {
        case 'sum':
          return args.reduce((a, b) => a + b, 0);
        case 'multiply':
          return args.reduce((a, b) => a * b, 1);
        case 'average':
          return args.reduce((a, b) => a + b, 0) / args.length;
        default:
          return 0;
      }
    });

    this.registerTool('text', (operation: string, text: string) => {
      switch (operation) {
        case 'uppercase':
          return text.toUpperCase();
        case 'lowercase':
          return text.toLowerCase();
        case 'reverse':
          return text.split('').reverse().join('');
        case 'length':
          return text.length;
        default:
          return text;
      }
    });
  }

  registerTool(name: string, fn: Function): void {
    this.tools.set(name, fn);
  }

  async executeTool(toolName: string, ...args: any[]): Promise<any> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`);
    }
    this.memory.recordAgentAction('ToolAgent', 'execute', { tool: toolName, args });
    return tool(...args);
  }

  getAvailableTools(): string[] {
    return Array.from(this.tools.keys());
  }
}
