import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { MemoryManager } from '../memory/MemoryManager';
import { NIMAdapter, ChatMessage } from '../nim/NIMAdapter';

export interface AgentConfig {
  name: string;
  role: string;
  description: string;
  systemPrompt: string;
  capabilities?: string[];
}

export abstract class AgentBase {
  protected id: string;
  protected config: AgentConfig;
  protected memory: MemoryManager;
  protected nim: NIMAdapter;
  protected conversationHistory: ChatMessage[] = [];

  constructor(config: AgentConfig, memory: MemoryManager, nim: NIMAdapter) {
    this.id = uuidv4();
    this.config = config;
    this.memory = memory;
    this.nim = nim;
    logger.info(`Agent initialized: ${config.name} (${this.id})`);
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.config.name;
  }

  getRole(): string {
    return this.config.role;
  }

  getCapabilities(): string[] {
    return this.config.capabilities || [];
  }

  async think(input: string, context?: Record<string, any>): Promise<string> {
    this.memory.recordAgentAction(this.config.name, 'think', { input });

    const messages: ChatMessage[] = [
      { role: 'system', content: this.config.systemPrompt },
      ...this.conversationHistory,
      { role: 'user', content: input },
    ];

    try {
      const response = await this.nim.createChatCompletion({
        model: 'meta/llama-2-70b-chat',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const output = response.choices[0].message.content;
      this.conversationHistory.push(
        { role: 'user', content: input },
        { role: 'assistant', content: output }
      );

      this.memory.recordResult('agent_response', {
        agent: this.config.name,
        output,
      });

      return output;
    } catch (error) {
      logger.error(`Agent ${this.config.name} failed:`, error);
      throw error;
    }
  }

  async execute(task: string, params?: Record<string, any>): Promise<any> {
    logger.info(`Executing task in ${this.config.name}: ${task}`);
    this.memory.recordAgentAction(this.config.name, 'execute', { task, params });
    return this.think(task, params);
  }

  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  clearHistory(): void {
    this.conversationHistory = [];
    logger.info(`Conversation history cleared for ${this.config.name}`);
  }
}
