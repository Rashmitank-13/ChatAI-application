# ChatAI

A modern AI chat application with a React TypeScript frontend and Node.js Express backend.

## Features

- **Landing Page**: Start new chats from a clean landing page
- **Left Sidebar**: 
  - View all chat sessions
  - Create new chats
  - User info display
  - Collapsible panel
- **Chat Interface**: 
  - Ask questions and get responses
  - Display answers in table format
  - Additional descriptions with responses
- **Feedback System**: Like/Dislike buttons for each answer
- **Dark/Light Theme**: Toggle between themes with persistent storage
- **Session Management**: 
  - URL-based session IDs
  - Session history tracking
  - Session titles auto-generated from first question

## Project Structure

```
chatgpt/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── chat.js          # API route handlers
│   │   ├── data/
│   │   │   └── mockData.js      # Mock JSON data
│   │   └── server.js             # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── contexts/             # React contexts (Theme, Session)
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `POST /api/chat/new` - Create a new chat session
- `POST /api/chat/:sessionId/ask` - Ask a question in a session
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:sessionId` - Get session history

## Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS, React Router
- **Backend**: Node.js, Express
- **Styling**: TailwindCSS with dark mode support

## Notes

- No database required - all data is stored in memory
- Sessions persist only while the server is running
- Mock data is served from JSON files
- Fully responsive design for mobile and desktop

