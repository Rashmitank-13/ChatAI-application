import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useSessions } from '../contexts/SessionContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  onSessionSelect?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onSessionSelect }) => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { theme } = useTheme();
  const { sessions, refreshSessions } = useSessions();

  const handleNewChat = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/new', {
        method: 'POST',
      });
      const data = await response.json();
      await refreshSessions();
      navigate(`/chat/${data.sessionId}`);
      if (onSessionSelect) {
        onSessionSelect();
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const handleSessionClick = (sessionId: string) => {
    navigate(`/chat/${sessionId}`);
    if (onSessionSelect) {
      onSessionSelect();
    }
  };

  return (
    <>
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          theme === 'dark'
            ? 'bg-gray-800 border-r border-gray-700'
            : 'bg-gray-50 border-r border-gray-200'
        } w-64 overflow-y-auto hide-scrollbar`}
      >
      <div className="p-3">
        <button
          onClick={handleNewChat}
          className={`w-full px-3 py-2 rounded-lg font-medium transition-colors mb-3 ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300'
          }`}
        >
          + New Chat
        </button>

        <div className={`mb-2 text-sm font-semibold ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Recent Chat
        </div>

        <div className="space-y-1">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => handleSessionClick(session.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                sessionId === session.id
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 text-gray-900'
                  : theme === 'dark'
                  ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <div className="truncate">{session.title}</div>
            </button>
          ))}
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;

