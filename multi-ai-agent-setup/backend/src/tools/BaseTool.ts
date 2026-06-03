export interface ToolInput {
  [key: string]: any;
}

export interface ToolOutput {
  success: boolean;
  data?: any;
  error?: string;
}

export abstract class BaseTool {
  abstract name: string;
  abstract description: string;
  abstract inputSchema: Record<string, any>;

  abstract execute(input: ToolInput): Promise<ToolOutput>;

  validateInput(input: ToolInput): boolean {
    for (const key of Object.keys(this.inputSchema)) {
      if (!(key in input)) {
        return false;
      }
    }
    return true;
  }
}
