import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, loading }) => {
  const [input, setInput] = useState('');
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className={`border-t ${
      theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
    }`}>
      <div className="max-w-3xl mx-auto px-4 py-3 md:px-6">
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-resize textarea
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Message ..."
                rows={1}
                className={`w-full px-3 py-2 rounded-2xl resize-none text-[15px] leading-[1.5] ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white placeholder-gray-400 border border-gray-600'
                    : 'bg-white text-gray-900 placeholder-gray-500 border border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                style={{ minHeight: '44px', maxHeight: '200px', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`px-3 py-2 rounded-2xl font-medium transition-colors flex-shrink-0 w-[44px] h-[44px] flex items-center justify-center ${
                input.trim() && !loading
                  ? theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;

