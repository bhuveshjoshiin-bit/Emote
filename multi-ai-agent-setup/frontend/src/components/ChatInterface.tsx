import React, { useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { InputBar } from './InputBar';

export const ChatInterface: React.FC = () => {
  const { messages, loading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Start a conversation with the AI agents...</p>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>
      <InputBar onSend={sendMessage} disabled={loading} />
    </div>
  );
};
