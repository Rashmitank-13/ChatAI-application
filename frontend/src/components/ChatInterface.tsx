import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useSessions } from '../contexts/SessionContext';
import { API_BASE_URL } from '../App';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

interface Message {
  type: 'user' | 'assistant';
  content: string;
  tableData?: any[];
  additionalInfo?: string[];
  timestamp: string;
  feedback?: 'like' | 'dislike' | null;
}

const ChatInterface: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { theme } = useTheme();
  const { refreshSessions } = useSessions();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionId) {
      loadSessionHistory();
    }
  }, [sessionId]);

  const loadSessionHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);
      const data = await response.json();
      if (data.session) {
        setMessages(data.session.messages || []);
      }
    } catch (error) {
      console.error('Error loading session history:', error);
    }
  };

  const handleSendMessage = async (question: string) => {
    if (!question.trim() || !sessionId) return;

    const userMessage: Message = {
      type: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/${sessionId}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
        refreshSessions();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (messageIndex: number, feedback: 'like' | 'dislike') => {
    setMessages(prev => {
      const updated = [...prev];
      if (updated[messageIndex].type === 'assistant') {
        updated[messageIndex].feedback = feedback;
      }
      return updated;
    });
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-4rem)] w-full ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="flex-1 overflow-y-auto w-full hide-scrollbar">
        <div className="max-w-3xl mx-auto px-4 py-4 md:px-6 w-full">
          {messages.length === 0 ? (
            <div className={`flex items-center justify-center h-full min-h-[400px] ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <div className="text-center">
                <p className="text-xl mb-2 font-medium">Start a conversation</p>
                <p className="text-sm">Ask a question to get started</p>
              </div>
            </div>
          ) : (
            <MessageList
              messages={messages}
              onFeedback={handleFeedback}
              loading={loading}
            />
          )}
        </div>
      </div>
      <ChatInput onSendMessage={handleSendMessage} loading={loading} />
    </div>
  );
};

export default ChatInterface;

