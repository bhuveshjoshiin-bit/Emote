import { BaseTool, ToolInput, ToolOutput } from './BaseTool';
import { logger } from '../utils/logger';

export class ToolRegistry {
  private tools: Map<string, BaseTool> = new Map();

  register(tool: BaseTool): void {
    this.tools.set(tool.name, tool);
    logger.info(`Tool registered: ${tool.name}`);
  }

  async execute(toolName: string, input: ToolInput): Promise<ToolOutput> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      return {
        success: false,
        error: `Tool not found: ${toolName}`,
      };
    }

    if (!tool.validateInput(input)) {
      return {
        success: false,
        error: `Invalid input for tool: ${toolName}`,
      };
    }

    try {
      return await tool.execute(input);
    } catch (error) {
      logger.error(`Tool execution failed: ${toolName}`, error);
      return {
        success: false,
        error: String(error),
      };
    }
  }

  listTools() {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    }));
  }
}
