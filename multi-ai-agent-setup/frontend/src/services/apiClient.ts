import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = {
  // Chat
  async sendMessage(message: string) {
    const response = await client.post('/chat', { message });
    return response.data;
  },

  async streamMessage(message: string) {
    const response = await client.post('/chat/stream', { message }, {
      responseType: 'stream',
    });
    return response.data;
  },

  // Agents
  async getAgents() {
    const response = await client.get('/agents');
    return response.data;
  },

  async getAgent(name: string) {
    const response = await client.get(`/agents/${name}`);
    return response.data;
  },

  async runAgent(agentName: string, task: string, params?: any) {
    const response = await client.post('/agents/run', {
      agentName,
      task,
      params,
    });
    return response.data;
  },

  // Memory
  async getMemory() {
    const response = await client.get('/memory');
    return response.data;
  },

  async getMemoryHistory() {
    const response = await client.get('/memory/history');
    return response.data;
  },

  async exportMemory() {
    const response = await client.get('/memory/export');
    return response.data;
  },

  async clearShortTermMemory() {
    const response = await client.delete('/memory/clear/short-term');
    return response.data;
  },

  async clearLongTermMemory() {
    const response = await client.delete('/memory/clear/long-term');
    return response.data;
  },
};
