const express = require('express');
const cors = require('cors');
const { startNewChat, askQuestion, getSessions, getSessionHistory } = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/chat/new', startNewChat);
app.post('/api/chat/:sessionId/ask', askQuestion);
app.get('/api/sessions', getSessions);
app.get('/api/sessions/:sessionId', getSessionHistory);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

