import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import TableView from './TableView';

interface Message {
  type: 'user' | 'assistant';
  content: string;
  tableData?: any[];
  additionalInfo?: string[];
  timestamp: string;
  feedback?: 'like' | 'dislike' | null;
}

interface MessageItemProps {
  message: Message;
  index: number;
  onFeedback: (index: number, feedback: 'like' | 'dislike') => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, index, onFeedback }) => {
  const { theme } = useTheme();

  if (message.type === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className={`max-w-[85%] md:max-w-[70%] px-3 py-2 rounded-2xl ${
          theme === 'dark'
            ? 'bg-gray-700 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className={`w-full max-w-[85%] md:max-w-[70%] ${
        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
      }`}>
        <div className={`px-3 py-2 rounded-2xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <p className="text-[15px] leading-relaxed mb-2 whitespace-pre-wrap break-words">{message.content}</p>
          
          {message.additionalInfo && message.additionalInfo.length > 0 && (
            <div className="mb-2 space-y-1">
              {message.additionalInfo.map((info, idx) => (
                <p key={idx} className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {info}
                </p>
              ))}
            </div>
          )}

          {message.tableData && message.tableData.length > 0 && (
            <div className="mb-2">
              <TableView data={message.tableData} />
            </div>
          )}

          <div className="flex items-center space-x-1 mt-2 pt-1">
            <button
              onClick={() => onFeedback(index, 'like')}
              className={`p-1.5 rounded-lg transition-colors ${
                message.feedback === 'like'
                  ? theme === 'dark'
                    ? 'bg-green-700 text-white'
                    : 'bg-green-100 text-green-700'
                  : theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-200 text-gray-500'
              }`}
              aria-label="Like"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </button>
            <button
              onClick={() => onFeedback(index, 'dislike')}
              className={`p-1.5 rounded-lg transition-colors ${
                message.feedback === 'dislike'
                  ? theme === 'dark'
                    ? 'bg-red-700 text-white'
                    : 'bg-red-100 text-red-700'
                  : theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-200 text-gray-500'
              }`}
              aria-label="Dislike"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;

