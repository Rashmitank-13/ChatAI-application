import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';

interface Session {
  id: string;
  title: string;
  createdAt: string;
  messageCount: number;
}

interface SessionContextType {
  sessions: Session[];
  refreshSessions: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);

  const refreshSessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`);
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  useEffect(() => {
    refreshSessions();
  }, []);

  return (
    <SessionContext.Provider value={{ sessions, refreshSessions }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessions must be used within SessionProvider');
  }
  return context;
}

