import { AgentBase, AgentConfig } from './AgentBase';
import { MemoryManager } from '../memory/MemoryManager';
import { NIMAdapter } from '../nim/NIMAdapter';

export class ReviewerAgent extends AgentBase {
  constructor(memory: MemoryManager, nim: NIMAdapter) {
    const config: AgentConfig = {
      name: 'Reviewer',
      role: 'Quality Assurance & Code Review',
      description: 'Reviews and validates outputs from other agents',
      systemPrompt: `You are a meticulous code reviewer and quality assurance expert. Your role is to:
1. Review code for correctness and quality
2. Identify potential bugs and issues
3. Check compliance with best practices
4. Suggest improvements and optimizations
5. Validate logic and edge case handling
6. Provide a quality score (0-100)

Provide reviews in JSON format:
{
  "score": number,
  "issues": [{"severity": "critical/warning/info", "description": "string"}],
  "suggestions": ["string"],
  "summary": "string"
}`,
      capabilities: [
        'code_review',
        'quality_assessment',
        'bug_detection',
        'performance_analysis',
      ],
    };
    super(config, memory, nim);
  }

  async reviewCode(code: string, language: string = 'typescript'): Promise<any> {
    const response = await this.think(
      `Review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
    );
    try {
      return JSON.parse(response);
    } catch {
      return {
        score: 75,
        issues: [],
        suggestions: [response],
        summary: response,
      };
    }
  }

  async validateOutput(output: any, outputType: string): Promise<any> {
    return this.think(
      `Validate this ${outputType} output: ${JSON.stringify(output)}`
    );
  }
}
