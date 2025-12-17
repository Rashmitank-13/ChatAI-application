import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import MessageItem from './MessageItem';

interface Message {
  type: 'user' | 'assistant';
  content: string;
  tableData?: any[];
  additionalInfo?: string[];
  timestamp: string;
  feedback?: 'like' | 'dislike' | null;
}

interface MessageListProps {
  messages: Message[];
  onFeedback: (index: number, feedback: 'like' | 'dislike') => void;
  loading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onFeedback, loading }) => {
  const { theme } = useTheme();

  return (
    <div className="w-full space-y-4">
      {messages.map((message, index) => (
        <MessageItem
          key={index}
          message={message}
          index={index}
          onFeedback={onFeedback}
        />
      ))}
      {loading && (
        <div className={`flex items-center space-x-2 py-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="ml-2 text-sm">Thinking...</span>
        </div>
      )}
    </div>
  );
};

export default MessageList;

