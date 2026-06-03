import axios, { AxiosInstance } from 'axios';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class NIMAdapter {
  private client: AxiosInstance;

  constructor(apiKey?: string, baseUrl?: string) {
    const key = apiKey || config.nvidia.apiKey;
    const url = baseUrl || config.nvidia.baseUrl;

    this.client = axios.create({
      baseURL: url,
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      timeout: config.retries.timeout,
    });
  }

  async createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      const response = await this.client.post<ChatCompletionResponse>(
        '/chat/completions',
        {
          model: request.model || config.nvidia.model,
          messages: request.messages,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.max_tokens ?? 512,
          top_p: request.top_p ?? 1.0,
        }
      );

      logger.info(`Chat completion successful - model: ${request.model}`);
      return response.data;
    } catch (error) {
      logger.error({ error, request }, 'Chat completion failed');
      throw error;
    }
  }

  async createChatCompletionStream(request: ChatCompletionRequest) {
    try {
      const response = await this.client.post(
        '/chat/completions',
        {
          model: request.model || config.nvidia.model,
          messages: request.messages,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.max_tokens ?? 512,
          top_p: request.top_p ?? 1.0,
          stream: true,
        },
        {
          responseType: 'stream',
        }
      );

      logger.info(`Stream initiated - model: ${request.model}`);
      return response.data;
    } catch (error) {
      logger.error({ error, request }, 'Stream creation failed');
      throw error;
    }
  }
}

export const nimAdapter = new NIMAdapter();
