import { AgentBase, AgentConfig } from './AgentBase';
import { MemoryManager } from '../memory/MemoryManager';
import { NIMAdapter } from '../nim/NIMAdapter';

export class CoderAgent extends AgentBase {
  constructor(memory: MemoryManager, nim: NIMAdapter) {
    const config: AgentConfig = {
      name: 'Coder',
      role: 'Code Generation & Implementation',
      description: 'Generates and implements code solutions',
      systemPrompt: `You are an expert software developer. Your role is to:
1. Generate clean, well-documented code
2. Follow best practices and design patterns
3. Handle edge cases and errors gracefully
4. Provide explanations of the code
5. Suggest testing approaches

When generating code:
- Use clear variable names
- Add helpful comments
- Include error handling
- Specify the programming language
- Format code in markdown code blocks`,
      capabilities: [
        'code_generation',
        'bug_fixing',
        'code_optimization',
        'architecture_design',
      ],
    };
    super(config, memory, nim);
  }

  async generateCode(requirement: string, language: string = 'typescript'): Promise<any> {
    const response = await this.think(
      `Generate ${language} code for: ${requirement}`
    );
    
    const codeMatch = response.match(/```[\w]*\n([\s\S]*?)\n```/);
    const code = codeMatch ? codeMatch[1] : response;
    
    await this.memory.saveCodeSnippet(requirement, code, language);
    
    return {
      code,
      language,
      explanation: response,
    };
  }

  async fixBug(bugDescription: string, code: string): Promise<string> {
    return this.think(
      `Fix this bug in the following code:\n\n\`\`\`\n${code}\n\`\`\`\n\nBug: ${bugDescription}`
    );
  }
}
