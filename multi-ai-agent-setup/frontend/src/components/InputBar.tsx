import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface InputBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-gray-800">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={disabled}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
      >
        <Send size={20} />
      </button>
    </form>
  );
};
