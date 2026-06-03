import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const bgColor = isUser ? 'bg-blue-600' : 'bg-gray-700';
  const textAlign = isUser ? 'text-right' : 'text-left';
  const bubbleAlign = isUser ? 'ml-auto' : 'mr-auto';

  return (
    <div className={`flex ${textAlign} mb-4`}>
      <div
        className={`${bgColor} ${bubbleAlign} rounded-lg px-4 py-2 max-w-xs text-white`}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};
