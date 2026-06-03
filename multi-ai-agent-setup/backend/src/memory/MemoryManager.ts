import { ShortTermMemory } from './ShortTermMemory';
import { LongTermMemory } from './LongTermMemory';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class MemoryManager {
  private shortTerm: ShortTermMemory;
  private longTerm: LongTermMemory;
  private sessionId: string;

  constructor() {
    this.sessionId = uuidv4();
    this.shortTerm = new ShortTermMemory(this.sessionId);
    this.longTerm = new LongTermMemory();
    logger.info(`MemoryManager initialized - session: ${this.sessionId}`);
  }

  // Short-term operations
  recordMessage(role: string, content: string): void {
    this.shortTerm.addEntry('message', { role, content });
  }

  recordAgentAction(agentName: string, action: string, params?: any): void {
    this.shortTerm.addEntry('agent_action', { agentName, action, params });
  }

  recordTask(taskId: string, description: string, priority?: string): void {
    this.shortTerm.addEntry('task', { taskId, description, priority });
  }

  recordResult(type: string, data: any): void {
    this.shortTerm.addEntry('result', { type, data });
  }

  getShortTermMemory() {
    return this.shortTerm.getEntries();
  }

  getRecentMemory(limit: number = 20) {
    return this.shortTerm.getRecent(limit);
  }

  getMemoryStats() {
    return this.shortTerm.getStats();
  }

  clearShortTerm(): void {
    this.shortTerm.clear();
  }

  // Long-term operations
  async saveConversation(messages: any[]): Promise<void> {
    const conversationId = uuidv4();
    await this.longTerm.addConversation(conversationId, messages);
    logger.info(`Conversation saved: ${conversationId}`);
  }

  async saveTask(description: string): Promise<string> {
    const taskId = uuidv4();
    await this.longTerm.addTask(taskId, description);
    return taskId;
  }

  async updateTaskStatus(taskId: string, status: string, result?: any): Promise<void> {
    await this.longTerm.updateTask(taskId, status, result);
  }

  async saveCodeSnippet(title: string, code: string, language: string): Promise<void> {
    await this.longTerm.addCodeSnippet(title, code, language);
  }

  async getConversationHistory(): Promise<any[]> {
    return this.longTerm.getConversations();
  }

  async getTaskHistory(): Promise<any[]> {
    return this.longTerm.getTasks();
  }

  async getCodeLibrary(): Promise<any[]> {
    return this.longTerm.getCodeSnippets();
  }

  async clearLongTerm(): Promise<void> {
    await this.longTerm.clear();
  }

  async exportMemory(): Promise<any> {
    return {
      session: this.sessionId,
      timestamp: new Date().toISOString(),
      shortTerm: this.getShortTermMemory(),
      longTerm: {
        conversations: await this.longTerm.getConversations(),
        tasks: await this.longTerm.getTasks(),
        codeSnippets: await this.longTerm.getCodeSnippets(),
      },
    };
  }
}
