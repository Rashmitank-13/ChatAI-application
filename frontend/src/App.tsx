import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import LandingPage from './components/LandingPage';
import TopBar from './components/TopBar';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { SessionProvider } from './contexts/SessionContext';

const API_BASE_URL = 'http://localhost:5000/api';

function AppContent() {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Show sidebar by default on desktop, hide on mobile
    return window.innerWidth >= 768;
  });

  // Close sidebar on mobile when window is resized to mobile size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex relative">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          onSessionSelect={() => {
            // Auto-close sidebar on mobile when session is selected
            if (window.innerWidth < 768) {
              setSidebarOpen(false);
            }
          }}
        />
        <main className={`flex-1 w-full min-w-0 transition-all duration-300 ${
          sidebarOpen 
            ? 'md:ml-64' 
            : 'ml-0'
        }`}>
          <div className="w-full h-full">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/chat/:sessionId" element={<ChatInterface />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <Router>
          <AppContent />
        </Router>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default App;
export { API_BASE_URL };

