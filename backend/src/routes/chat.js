const { simpleResponses } = require('../data/mockData');

// In-memory storage (no database)
let sessions = {};
let sessionCounter = 1;

// Generate session title from first question
function generateSessionTitle(question) {
  const words = question.split(' ').slice(0, 5).join(' ');
  return words.length > 30 ? words.substring(0, 30) + '...' : words;
}

// Start new chat
function startNewChat(req, res) {
  const sessionId = `session-${sessionCounter++}`;
  const timestamp = new Date().toISOString();
  
  sessions[sessionId] = {
    id: sessionId,
    title: 'New Chat',
    createdAt: timestamp,
    messages: []
  };

  res.json({ sessionId, timestamp });
}

// Ask question in a session
function askQuestion(req, res) {
  const { sessionId } = req.params;
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }

  // Add user question to session
  sessions[sessionId].messages.push({
    type: 'user',
    content: question,
    timestamp: new Date().toISOString()
  });

  // Update session title if it's the first question
  if (sessions[sessionId].title === 'New Chat' && sessions[sessionId].messages.length === 1) {
    sessions[sessionId].title = generateSessionTitle(question);
  }

  // Return simple text response (always single line sentence)
  const randomSimpleResponse = simpleResponses[Math.floor(Math.random() * simpleResponses.length)];
  const assistantMessage = {
    type: 'assistant',
    content: randomSimpleResponse,
    timestamp: new Date().toISOString(),
    feedback: null
  };

  sessions[sessionId].messages.push(assistantMessage);

  res.json({
    sessionId,
    message: assistantMessage
  });
}

// Get all sessions
function getSessions(req, res) {
  const sessionList = Object.values(sessions).map(session => ({
    id: session.id,
    title: session.title,
    createdAt: session.createdAt,
    messageCount: session.messages.length
  }));

  // Sort by creation date (newest first)
  sessionList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ sessions: sessionList });
}

// Get session history
function getSessionHistory(req, res) {
  const { sessionId } = req.params;

  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({
    session: sessions[sessionId]
  });
}

module.exports = {
  startNewChat,
  askQuestion,
  getSessions,
  getSessionHistory
};

