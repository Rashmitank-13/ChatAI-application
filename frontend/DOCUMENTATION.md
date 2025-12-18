# Frontend Documentation - Line by Line Explanation

## Table of Contents
1. [App Component (App.tsx)](#app-component)
2. [Chat Interface (ChatInterface.tsx)](#chat-interface)
3. [Theme Context](#theme-context)
4. [Session Context](#session-context)
5. [Key Components Overview](#key-components)

---

## App Component (App.tsx)

### File: `frontend/src/App.tsx`

```typescript
import React, { useState, useEffect } from 'react';
```
**Explanation**: Imports React and hooks. `useState` manages component state, `useEffect` handles side effects (like API calls, event listeners).

```typescript
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
```
**Explanation**: Imports React Router for navigation:
- `Router`: Wraps the app to enable routing
- `Routes` & `Route`: Define URL paths and their components
- `useNavigate`: Programmatic navigation
- `useParams`: Access URL parameters

```typescript
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import LandingPage from './components/LandingPage';
import TopBar from './components/TopBar';
```
**Explanation**: Imports custom components. These are reusable UI pieces that make up the application.

```typescript
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { SessionProvider } from './contexts/SessionContext';
```
**Explanation**: Imports Context providers and hooks. Context API allows sharing state across components without prop drilling.

```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```
**Explanation**: Base URL for all API calls. Centralized so it's easy to change for production. Exported so other components can use it.

```typescript
function AppContent() {
  const { theme } = useTheme();
```
**Explanation**: Inner component that uses the theme context. `useTheme()` hook gives access to current theme and toggle function.

```typescript
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return window.innerWidth >= 768;
  });
```
**Explanation**: 
- `useState` manages sidebar visibility state
- Initializer function runs once on mount
- Checks screen width: shows sidebar on desktop (≥768px), hides on mobile
- This is a lazy initialization pattern

```typescript
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
```
**Explanation**: 
- `useEffect` runs after render
- Creates event handler for window resize
- If window becomes mobile-sized and sidebar is open, closes it
- This ensures responsive behavior

```typescript
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);
```
**Explanation**: 
- Adds resize event listener
- Cleanup function removes listener when component unmounts or dependencies change
- `[sidebarOpen]` dependency array: effect re-runs when sidebarOpen changes
- Prevents memory leaks

```typescript
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
```
**Explanation**: 
- Main container div
- Template literal with conditional className
- `min-h-screen`: Full viewport height
- Dynamic background color based on theme

```typescript
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
```
**Explanation**: TopBar component receives sidebar state and setter as props. This is "lifting state up" - parent manages state, children receive it.

```typescript
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          onSessionSelect={() => {
            if (window.innerWidth < 768) {
              setSidebarOpen(false);
            }
          }}
        />
```
**Explanation**: 
- Sidebar receives open state and callbacks
- `onClose`: Closes sidebar when overlay is clicked
- `onSessionSelect`: Auto-closes sidebar on mobile when user selects a session
- Inline arrow function for callback

```typescript
        <main className={`flex-1 w-full min-w-0 transition-all duration-300 ${
          sidebarOpen 
            ? 'md:ml-64' 
            : 'ml-0'
        }`}>
```
**Explanation**: 
- Main content area
- `flex-1`: Takes remaining space
- `min-w-0`: Prevents flex item from overflowing
- Conditional margin: adds left margin on desktop when sidebar is open
- `transition-all`: Smooth animation when sidebar toggles

```typescript
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat/:sessionId" element={<ChatInterface />} />
          </Routes>
```
**Explanation**: 
- Defines application routes
- `/`: Landing page (home)
- `/chat/:sessionId`: Dynamic route where `:sessionId` is a parameter
- Example: `/chat/session-1` renders ChatInterface with sessionId="session-1"

```typescript
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
```
**Explanation**: 
- Root component with provider pattern
- `ThemeProvider`: Makes theme available to all children
- `SessionProvider`: Makes session data available to all children
- `Router`: Enables routing functionality
- Order matters: providers wrap Router, Router wraps content

```typescript
export default App;
export { API_BASE_URL };
```
**Explanation**: 
- Default export: App component (imported as `import App from './App'`)
- Named export: API_BASE_URL constant (imported as `import { API_BASE_URL } from './App'`)

---

## Chat Interface (ChatInterface.tsx)

### File: `frontend/src/components/ChatInterface.tsx`

```typescript
interface Message {
  type: 'user' | 'assistant';
  content: string;
  tableData?: any[];
  additionalInfo?: string[];
  timestamp: string;
  feedback?: 'like' | 'dislike' | null;
}
```
**Explanation**: TypeScript interface defining the Message type:
- `type`: Union type - either 'user' or 'assistant'
- `content`: Required string
- `?`: Makes properties optional
- `any[]`: Array of any type (flexible for table data)
- Type safety ensures messages follow this structure

```typescript
const ChatInterface: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
```
**Explanation**: 
- Functional component with TypeScript
- `useParams` extracts URL parameters
- Generic type `<{ sessionId: string }>` tells TypeScript the parameter type
- Gets sessionId from URL (e.g., `/chat/session-1` → `sessionId = "session-1"`)

```typescript
  const { theme } = useTheme();
  const { refreshSessions } = useSessions();
```
**Explanation**: 
- Gets theme from context (for styling)
- Gets refreshSessions function to update session list after new messages

```typescript
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
```
**Explanation**: 
- `messages`: Array of Message objects, initialized as empty array
- `loading`: Boolean flag to show loading state
- TypeScript generic `<Message[]>` ensures type safety

```typescript
  useEffect(() => {
    if (sessionId) {
      loadSessionHistory();
    }
  }, [sessionId]);
```
**Explanation**: 
- Runs when component mounts or sessionId changes
- Loads chat history when user navigates to a session
- Dependency array `[sessionId]` means effect re-runs when sessionId changes

```typescript
  const loadSessionHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);
```
**Explanation**: 
- `async` function for asynchronous API call
- `fetch`: Browser API for HTTP requests
- Template literal builds URL: `http://localhost:5000/api/sessions/session-1`
- GET request by default

```typescript
      const data = await response.json();
      if (data.session) {
        setMessages(data.session.messages || []);
      }
```
**Explanation**: 
- `await`: Waits for response to be parsed as JSON
- Checks if session exists in response
- Updates messages state with session's message history
- `|| []`: Fallback to empty array if messages is undefined

```typescript
    } catch (error) {
      console.error('Error loading session history:', error);
    }
```
**Explanation**: Error handling. If API call fails, logs error to console. User sees empty chat (graceful degradation).

```typescript
  const handleSendMessage = async (question: string) => {
    if (!question.trim() || !sessionId) return;
```
**Explanation**: 
- Validates input: checks if question has content (after trimming whitespace)
- Checks if sessionId exists
- Early return prevents invalid API calls

```typescript
    const userMessage: Message = {
      type: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };
```
**Explanation**: Creates message object following Message interface. TypeScript ensures structure matches interface.

```typescript
    setMessages(prev => [...prev, userMessage]);
```
**Explanation**: 
- Updates state using functional update
- `prev`: Previous messages array
- `...prev`: Spreads existing messages
- Adds new userMessage to end
- Creates new array (immutability - React best practice)

```typescript
    setLoading(true);
```
**Explanation**: Sets loading state to show "thinking" indicator while waiting for response.

```typescript
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${sessionId}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
```
**Explanation**: 
- POST request to send question
- `headers`: Tells server we're sending JSON
- `body`: Converts JavaScript object to JSON string
- `{ question }` is shorthand for `{ question: question }`

```typescript
      const data = await response.json();
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
        refreshSessions();
      }
```
**Explanation**: 
- Parses JSON response
- Adds assistant's message to messages array
- `refreshSessions()`: Updates sidebar session list (to show new message count)

```typescript
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
```
**Explanation**: 
- `catch`: Handles errors (network failure, etc.)
- `finally`: Always runs, even if error occurs
- Resets loading state so UI isn't stuck in loading

```typescript
  const handleFeedback = (messageIndex: number, feedback: 'like' | 'dislike') => {
    setMessages(prev => {
      const updated = [...prev];
      if (updated[messageIndex].type === 'assistant') {
        updated[messageIndex].feedback = feedback;
      }
      return updated;
    });
  };
```
**Explanation**: 
- Updates feedback on a specific message
- Creates copy of messages array (immutability)
- Only updates feedback if message is from assistant
- Returns new array to trigger re-render

```typescript
  return (
    <div className={`flex flex-col h-[calc(100vh-4rem)] w-full ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`}>
```
**Explanation**: 
- Container with flexbox column layout
- Height: viewport height minus 4rem (for top bar)
- Dynamic background based on theme

```typescript
      <div className="flex-1 overflow-y-auto w-full hide-scrollbar">
```
**Explanation**: 
- Scrollable message area
- `flex-1`: Takes remaining vertical space
- `overflow-y-auto`: Enables vertical scrolling
- `hide-scrollbar`: Custom class to hide scrollbar (CSS in index.css)

```typescript
          {messages.length === 0 ? (
            <div>Start a conversation</div>
          ) : (
            <MessageList messages={messages} onFeedback={handleFeedback} loading={loading} />
          )}
```
**Explanation**: 
- Conditional rendering: ternary operator
- If no messages: shows empty state
- If messages exist: renders MessageList component
- Passes messages, feedback handler, and loading state as props

```typescript
      <ChatInput onSendMessage={handleSendMessage} loading={loading} />
```
**Explanation**: Chat input component at bottom. Receives send handler and loading state to disable input while processing.

---

## Theme Context

### File: `frontend/src/contexts/ThemeContext.tsx`

**Purpose**: Manages dark/light theme state globally

**Key Concepts**:
- `createContext`: Creates context object
- `useState`: Manages theme state
- `localStorage`: Persists theme preference
- `useEffect`: Applies theme to document
- `useContext`: Hook to access theme in components

**How it works**:
1. Theme stored in localStorage (persists across page reloads)
2. Initial state reads from localStorage or defaults to 'light'
3. `useEffect` adds/removes 'dark' class on document element
4. Components use `useTheme()` hook to access theme and toggle function

---

## Session Context

### File: `frontend/src/contexts/SessionContext.tsx`

**Purpose**: Manages list of all chat sessions globally

**Key Concepts**:
- Fetches sessions from API on mount
- Provides `refreshSessions()` function to update list
- Components can access sessions without prop drilling

**How it works**:
1. `useEffect` fetches sessions when provider mounts
2. Stores sessions in state
3. `refreshSessions()` can be called to refetch (e.g., after new message)

---

## Key Components Overview

### 1. **Sidebar Component**
- Displays list of chat sessions
- "New Chat" button creates new session
- Clicking session navigates to that chat
- Auto-closes on mobile when session selected

### 2. **MessageList Component**
- Renders array of messages
- Maps over messages array
- Passes each message to MessageItem component

### 3. **MessageItem Component**
- Renders individual message (user or assistant)
- Different styling for user vs assistant
- Like/dislike buttons for assistant messages
- Handles feedback updates

### 4. **ChatInput Component**
- Textarea for user input
- Send button
- Auto-resizes textarea as user types
- Disabled while loading

### 5. **TopBar Component**
- App title
- Menu button (toggle sidebar)
- Theme toggle button

---

## Key Concepts for Interview

### 1. **React Hooks**
- `useState`: Component state management
- `useEffect`: Side effects (API calls, event listeners)
- `useContext`: Access context values
- `useParams`: Get URL parameters

### 2. **Context API**
- Avoids prop drilling
- Global state management
- Provider pattern

### 3. **React Router**
- Client-side routing
- Dynamic routes with parameters
- Programmatic navigation

### 4. **TypeScript**
- Type safety
- Interfaces define data structures
- Prevents runtime errors

### 5. **State Management**
- Local state: `useState` in components
- Global state: Context API
- Immutability: Always create new objects/arrays

### 6. **API Integration**
- `fetch` for HTTP requests
- `async/await` for asynchronous code
- Error handling with try/catch

### 7. **Responsive Design**
- TailwindCSS utility classes
- Conditional rendering based on screen size
- Mobile-first approach

### 8. **Component Architecture**
- Functional components
- Props for data flow
- Separation of concerns (UI, logic, data)

