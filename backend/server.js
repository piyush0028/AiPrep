const express = require('express');
const cors = require('cors');
require('dotenv').config();
// const { generateExplanation } = require('./src/services/openaiService');
const { generateExplanation } = require('./src/services/ollamaHTTPService');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Store data and SSE clients
let questions = [];
let answers = [];
let clients = [];

// SSE endpoint
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'SSE connection established' })}\n\n`);

  req.on('close', () => {
    console.log(`Client ${clientId} disconnected`);
    clients = clients.filter(client => client.id !== clientId);
  });
});

// Send SSE to all clients
function sendSSE(data) {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// POST /api/questions - Submit a question
app.post('/api/questions', async (req, res) => {
  const { userId, question } = req.body;
  
  if (!userId || !question) {
    return res.status(400).json({ error: 'userId and question are required' });
  }

  const questionId = `q_${Date.now()}`;
  const answerId = `a_${Date.now()}`;

  const newQuestion = {
    id: questionId,
    userId,
    question,
    answerId,
    createdAt: new Date().toISOString()
  };

  questions.push(newQuestion);

  // Send question via SSE
  sendSSE({
    type: 'question_created',
    question: newQuestion
  });

 
  

// Generate response using OpenAI
setTimeout(async () => {
  try {
    // Generate real explanation using OpenAI
    const explanation = await generateExplanation(question);
    
    const realAnswer = {
      id: answerId,
      questionId,
      text: explanation.text,
      visualization: explanation.visualization || {
        id: `vis_${Date.now()}`,
        duration: 4000,
        fps: 30,
        layers: [
          {
            id: 'element1',
            type: 'circle',
            props: { 
              x: 100, 
              y: 200, 
              r: 20, 
              fill: '#3498db' 
            },
            animations: [
              { 
                property: 'x', 
                from: 100, 
                to: 400, 
                start: 0, 
                end: 3000 
              }
            ]
          }
        ]
      },
      createdAt: new Date().toISOString()
    };

    answers.push(realAnswer);

    // Send answer via SSE
    sendSSE({
      type: 'answer_created',
      answer: realAnswer
    });

  } catch (error) {
    console.error('Error generating answer:', error);
    
    // Fallback to mock answer if OpenAI fails
    const mockAnswer = {
      id: answerId,
      questionId,
      text: `Sorry, I encountered an error. But generally: "${question}" is an important concept that can be visualized.`,
      visualization: {
        id: `vis_${Date.now()}`,
        duration: 4000,
        fps: 30,
        layers: [
          {
            id: 'element1',
            type: 'circle',
            props: { 
              x: 100, 
              y: 200, 
              r: 20, 
              fill: '#3498db' 
            },
            animations: [
              { 
                property: 'x', 
                from: 100, 
                to: 400, 
                start: 0, 
                end: 3000 
              }
            ]
          }
        ]
      },
      createdAt: new Date().toISOString()
    };

    answers.push(mockAnswer);
    sendSSE({
      type: 'answer_created',
      answer: mockAnswer
    });
  }
}, 2000);





  res.json({ 
    questionId,
    answerId
  });
});

// GET /api/questions - Fetch all questions
app.get('/api/questions', (req, res) => {
  res.json(questions);
});

// GET /api/answers/:id - Fetch answer with visualization
app.get('/api/answers/:id', (req, res) => {
  const answerId = req.params.id;
  const answer = answers.find(a => a.id === answerId);
  
  if (!answer) {
    return res.status(404).json({ error: 'Answer not found' });
  }
  
  res.json(answer);
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'AiPrep Backend is running!',
    endpoints: {
      questions: '/api/questions',
      answers: '/api/answers/:id',
      stream: '/api/stream'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SSE endpoint available at: http://localhost:${PORT}/api/stream`);
});