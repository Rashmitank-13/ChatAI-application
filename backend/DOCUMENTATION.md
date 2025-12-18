# Backend Documentation - Line by Line Explanation

## Table of Contents
1. [Server Setup (server.js)](#server-setup)
2. [API Routes (routes/chat.js)](#api-routes)
3. [Mock Data (data/mockData.js)](#mock-data)

---

## Server Setup (server.js)

### File: `backend/src/server.js`

```javascript
const express = require('express');
```
**Explanation**: Imports the Express framework. Express is a Node.js web framework that simplifies creating HTTP servers and handling routes.

```javascript
const cors = require('cors');
```
**Explanation**: Imports CORS (Cross-Origin Resource Sharing) middleware. This allows the frontend (running on port 3000) to make requests to the backend (port 5000) without browser security errors.

```javascript
const { startNewChat, askQuestion, getSessions, getSessionHistory } = require('./routes/chat');
```
**Explanation**: Imports route handler functions from the chat routes file. These functions handle different API endpoints.

```javascript
const app = express();
```
**Explanation**: Creates an Express application instance. This is the main app object that we'll configure and use to handle requests.

```javascript
const PORT = process.env.PORT || 5000;
```
**Explanation**: Sets the server port. Uses environment variable PORT if available (for production), otherwise defaults to 5000. This allows flexibility for deployment.

```javascript
app.use(cors());
```
**Explanation**: Applies CORS middleware to all routes. This enables cross-origin requests from the frontend.

```javascript
app.use(express.json());
```
**Explanation**: Middleware to parse JSON request bodies. When frontend sends JSON data, Express automatically converts it to a JavaScript object accessible via `req.body`.

```javascript
// API Routes
app.post('/api/chat/new', startNewChat);
```
**Explanation**: Defines a POST endpoint at `/api/chat/new`. When a POST request is made here, it calls the `startNewChat` function. Used to create a new chat session.

```javascript
app.post('/api/chat/:sessionId/ask', askQuestion);
```
**Explanation**: POST endpoint with a URL parameter `:sessionId`. The `:` makes it a dynamic parameter. Example: `/api/chat/session-1/ask` where `session-1` is the sessionId. Used to send a question in a specific session.

```javascript
app.get('/api/sessions', getSessions);
```
**Explanation**: GET endpoint to retrieve all chat sessions. Returns a list of all sessions with their metadata.

```javascript
app.get('/api/sessions/:sessionId', getSessionHistory);
```
**Explanation**: GET endpoint to retrieve full chat history for a specific session. The `:sessionId` parameter identifies which session's history to return.

```javascript
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```
**Explanation**: Starts the server listening on the specified PORT. The callback function runs when the server successfully starts, logging a confirmation message.

---

## API Routes (routes/chat.js)

### File: `backend/src/routes/chat.js`

```javascript
const { simpleResponses } = require('../data/mockData');
```
**Explanation**: Imports the array of simple text responses from the mock data file. These are pre-written responses that the AI will randomly return.

```javascript
// In-memory storage (no database)
let sessions = {};
```
**Explanation**: Creates an object to store all chat sessions in memory. Each session is stored as a key-value pair where the key is the sessionId. This is temporary storage - data is lost when the server restarts.

```javascript
let sessionCounter = 1;
```
**Explanation**: Counter to generate unique session IDs. Increments each time a new session is created.

```javascript
function generateSessionTitle(question) {
  const words = question.split(' ').slice(0, 5).join(' ');
  return words.length > 30 ? words.substring(0, 30) + '...' : words;
}
```
**Explanation**: 
- `question.split(' ')`: Splits the question string into an array of words
- `.slice(0, 5)`: Takes only the first 5 words
- `.join(' ')`: Joins them back into a string
- If the result is longer than 30 characters, truncates to 30 and adds '...'
- This creates a short title for the chat session based on the first question

```javascript
function startNewChat(req, res) {
```
**Explanation**: Route handler function. `req` (request) contains data from the client. `res` (response) is used to send data back to the client.

```javascript
  const sessionId = `session-${sessionCounter++}`;
```
**Explanation**: Creates a unique session ID by combining "session-" with an incrementing number. The `++` increments the counter after using it.

```javascript
  const timestamp = new Date().toISOString();
```
**Explanation**: Gets the current date/time and converts it to ISO 8601 format (e.g., "2024-01-15T10:30:00.000Z"). This is a standard format for timestamps.

```javascript
  sessions[sessionId] = {
    id: sessionId,
    title: 'New Chat',
    createdAt: timestamp,
    messages: []
  };
```
**Explanation**: Creates a new session object in the sessions object. Each session has:
- `id`: Unique identifier
- `title`: Display name (starts as "New Chat", will be updated with first question)
- `createdAt`: When the session was created
- `messages`: Array to store all messages in this conversation

```javascript
  res.json({ sessionId, timestamp });
```
**Explanation**: Sends a JSON response back to the client with the new sessionId and timestamp. The client uses this sessionId for all subsequent requests.

```javascript
function askQuestion(req, res) {
  const { sessionId } = req.params;
  const { question } = req.body;
```
**Explanation**: Extracts `sessionId` from URL parameters and `question` from the request body. Destructuring syntax makes this cleaner than `req.params.sessionId`.

```javascript
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }
```
**Explanation**: Validation check. If no question is provided, immediately return a 400 (Bad Request) status with an error message. The `return` stops further execution.

```javascript
  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }
```
**Explanation**: Checks if the session exists. If not, returns 404 (Not Found) error. This prevents errors when trying to access non-existent sessions.

```javascript
  sessions[sessionId].messages.push({
    type: 'user',
    content: question,
    timestamp: new Date().toISOString()
  });
```
**Explanation**: Adds the user's question to the session's messages array. The message object includes:
- `type`: Identifies this as a user message (vs assistant message)
- `content`: The actual question text
- `timestamp`: When the message was sent

```javascript
  if (sessions[sessionId].title === 'New Chat' && sessions[sessionId].messages.length === 1) {
    sessions[sessionId].title = generateSessionTitle(question);
  }
```
**Explanation**: Updates the session title if this is the first message. Checks both that title is still "New Chat" and that there's exactly 1 message (the one we just added).

```javascript
  const randomSimpleResponse = simpleResponses[Math.floor(Math.random() * simpleResponses.length)];
```
**Explanation**: 
- `Math.random()`: Generates a random number between 0 and 1
- `* simpleResponses.length`: Scales it to the array length
- `Math.floor()`: Rounds down to get a valid array index
- Selects a random response from the mock data array

```javascript
  const assistantMessage = {
    type: 'assistant',
    content: randomSimpleResponse,
    timestamp: new Date().toISOString(),
    feedback: null
  };
```
**Explanation**: Creates the assistant's response message object. `feedback: null` will be updated if the user likes/dislikes the response.

```javascript
  sessions[sessionId].messages.push(assistantMessage);
```
**Explanation**: Adds the assistant's response to the messages array, right after the user's question.

```javascript
  res.json({
    sessionId,
    message: assistantMessage
  });
```
**Explanation**: Sends the response back to the frontend with the sessionId and the complete message object.

```javascript
function getSessions(req, res) {
  const sessionList = Object.values(sessions).map(session => ({
    id: session.id,
    title: session.title,
    createdAt: session.createdAt,
    messageCount: session.messages.length
  }));
```
**Explanation**: 
- `Object.values(sessions)`: Converts the sessions object into an array of session objects
- `.map()`: Transforms each session, creating a new object with only the needed fields
- `messageCount`: Calculates how many messages are in each session

```javascript
  sessionList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
```
**Explanation**: Sorts sessions by creation date. Subtracting dates returns milliseconds difference. Negative means `b` is newer, so newest sessions appear first.

```javascript
  res.json({ sessions: sessionList });
```
**Explanation**: Returns the sorted list of sessions wrapped in an object.

```javascript
function getSessionHistory(req, res) {
  const { sessionId } = req.params;
```
**Explanation**: Extracts sessionId from the URL parameter.

```javascript
  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }
```
**Explanation**: Validates that the session exists before proceeding.

```javascript
  res.json({
    session: sessions[sessionId]
  });
```
**Explanation**: Returns the complete session object, including all messages in the conversation history.

```javascript
module.exports = {
  startNewChat,
  askQuestion,
  getSessions,
  getSessionHistory
};
```
**Explanation**: Exports all four functions so they can be imported in `server.js`. This is Node.js module system.

---

## Mock Data (data/mockData.js)

### File: `backend/src/data/mockData.js`

```javascript
// Simple text responses - all responses are single line sentences
const simpleResponses = [
  "Hello! How can I help you today?",
  // ... more responses
];
```
**Explanation**: Array of pre-written response strings. When a user asks a question, the backend randomly selects one of these responses to simulate an AI assistant.

```javascript
module.exports = {
  simpleResponses
};
```
**Explanation**: Exports the array so it can be imported in the routes file. This keeps data separate from logic (separation of concerns).

---

## Key Concepts for Interview

### 1. **RESTful API Design**
- POST for creating (new chat, asking question)
- GET for retrieving (sessions, history)
- URL parameters (`:sessionId`) for resource identification

### 2. **In-Memory Storage**
- No database - data stored in JavaScript objects
- Data is temporary (lost on server restart)
- Simple for prototyping, not for production

### 3. **Middleware**
- `cors()`: Handles cross-origin requests
- `express.json()`: Parses JSON request bodies

### 4. **Error Handling**
- Status codes: 400 (Bad Request), 404 (Not Found)
- Early returns for validation

### 5. **Session Management**
- Unique session IDs
- Messages stored per session
- Title generation from first question

### 6. **Modular Code Structure**
- Routes separated from server setup
- Data separated from logic
- Functions exported/imported for reusability

