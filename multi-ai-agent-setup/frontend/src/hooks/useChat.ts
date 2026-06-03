import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import { Message } from '../types';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      try {
        setLoading(true);
        setError(null);

        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);

        const response = await apiClient.sendMessage(content);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.message,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
};
