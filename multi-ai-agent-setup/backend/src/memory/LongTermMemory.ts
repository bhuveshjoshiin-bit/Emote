import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';
import { config } from '../utils/config';

export interface PersistedMemory {
  conversations: Array<{ id: string; messages: any[]; createdAt: number; updatedAt: number }>;
  tasks: Array<{ id: string; description: string; status: string; result?: any; createdAt: number }>;
  agents: Array<{ name: string; config: any; lastUsed: number }>;
  codeSnippets: Array<{ id: string; title: string; code: string; language: string; createdAt: number }>;
}

export class LongTermMemory {
  private dbPath: string;
  private data: PersistedMemory = {
    conversations: [],
    tasks: [],
    agents: [],
    codeSnippets: [],
  };

  constructor() {
    this.dbPath = path.join(config.storage.path, 'memory.json');
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await fs.mkdir(config.storage.path, { recursive: true });
      await this.load();
      logger.info('Long-term memory initialized');
    } catch (error) {
      logger.warn('Could not initialize long-term memory:', error);
    }
  }

  async load(): Promise<void> {
    try {
      const content = await fs.readFile(this.dbPath, 'utf-8');
      this.data = JSON.parse(content);
      logger.info('Long-term memory loaded');
    } catch (error) {
      logger.info('Starting with empty long-term memory');
      this.data = {
        conversations: [],
        tasks: [],
        agents: [],
        codeSnippets: [],
      };
    }
  }

  async save(): Promise<void> {
    try {
      await fs.mkdir(config.storage.path, { recursive: true });
      await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
      logger.debug('Long-term memory saved');
    } catch (error) {
      logger.error('Failed to save long-term memory:', error);
    }
  }

  async addConversation(id: string, messages: any[]): Promise<void> {
    this.data.conversations.push({
      id,
      messages,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    await this.save();
  }

  async addTask(id: string, description: string): Promise<void> {
    this.data.tasks.push({
      id,
      description,
      status: 'pending',
      createdAt: Date.now(),
    });
    await this.save();
  }

  async updateTask(id: string, status: string, result?: any): Promise<void> {
    const task = this.data.tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      task.result = result;
      await this.save();
    }
  }

  async addCodeSnippet(title: string, code: string, language: string): Promise<void> {
    const { v4: uuidv4 } = await import('uuid');
    this.data.codeSnippets.push({
      id: uuidv4(),
      title,
      code,
      language,
      createdAt: Date.now(),
    });
    await this.save();
  }

  getConversations() {
    return this.data.conversations;
  }

  getTasks() {
    return this.data.tasks;
  }

  getCodeSnippets() {
    return this.data.codeSnippets;
  }

  async clear(): Promise<void> {
    this.data = {
      conversations: [],
      tasks: [],
      agents: [],
      codeSnippets: [],
    };
    await this.save();
    logger.info('Long-term memory cleared');
  }
}
