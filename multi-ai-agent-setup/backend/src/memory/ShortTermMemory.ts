import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

export interface MemoryEntry {
  id: string;
  timestamp: number;
  type: 'message' | 'agent_action' | 'task' | 'result';
  data: any;
  metadata?: Record<string, any>;
}

export class ShortTermMemory {
  private entries: MemoryEntry[] = [];
  private maxEntries: number = 1000;
  private sessionId: string;

  constructor(sessionId?: string) {
    this.sessionId = sessionId || uuidv4();
    logger.info(`Short-term memory initialized - session: ${this.sessionId}`);
  }

  addEntry(type: string, data: any, metadata?: Record<string, any>): MemoryEntry {
    const entry: MemoryEntry = {
      id: uuidv4(),
      timestamp: Date.now(),
      type: type as any,
      data,
      metadata,
    };

    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }

    return entry;
  }

  getEntries(type?: string): MemoryEntry[] {
    if (!type) return this.entries;
    return this.entries.filter((e) => e.type === type);
  }

  getRecent(limit: number = 10): MemoryEntry[] {
    return this.entries.slice(-limit);
  }

  clear(): void {
    this.entries = [];
    logger.info('Short-term memory cleared');
  }

  getStats() {
    return {
      sessionId: this.sessionId,
      totalEntries: this.entries.length,
      byType: {
        messages: this.getEntries('message').length,
        agentActions: this.getEntries('agent_action').length,
        tasks: this.getEntries('task').length,
        results: this.getEntries('result').length,
      },
      oldestEntry: this.entries[0]?.timestamp || null,
      newestEntry: this.entries[this.entries.length - 1]?.timestamp || null,
    };
  }
}
