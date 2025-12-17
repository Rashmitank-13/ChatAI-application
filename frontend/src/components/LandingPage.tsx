import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useSessions } from '../contexts/SessionContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { refreshSessions } = useSessions();

  const handleNewChat = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/new', {
        method: 'POST',
      });
      const data = await response.json();
      await refreshSessions();
      navigate(`/chat/${data.sessionId}`);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 md:p-6 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="max-w-2xl w-full text-center px-4">
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Welcome to ChatAI
        </h1>
        <p className={`text-base md:text-lg mb-8 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Start a new conversation to get answers with structured data
        </p>
        <button
          onClick={handleNewChat}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          }`}
        >
          Start New Chat
        </button>
      </div>
    </div>
  );
};

export default LandingPage;

