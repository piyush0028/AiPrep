import React, { useState } from 'react';
import { useSSE } from './hooks/useSSE';
import VisualizationCanvas from './components/VisualizationCanvas';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentVisualization, setCurrentVisualization] = useState(null);

  // Handle SSE messages
  useSSE('http://localhost:5000/api/stream', (data) => {
    console.log('SSE message received:', data);
    
    if (data.type === 'question_created') {
      setIsTyping(true);
      setMessages(prev => [...prev, {
        type: 'question',
        content: data.question.question,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
    
    if (data.type === 'answer_created') {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        type: 'answer',
        content: data.answer.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        answerData: data.answer
      }]);
      // Set the visualization data - ADD THIS LINE
      setCurrentVisualization(data.answer.visualization);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'u1',
          question: question.trim()
        })
      });

      const data = await response.json();
      console.log('Question submitted:', data);
      setQuestion('');
    } catch (error) {
      console.error('Error submitting question:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Failed to send question. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AiPrep Learning Assistant</h1>
        <p>Ask any concept and see it visualized! (Real-time SSE enabled)</p>
      </header>
      
      <div className="app-container">
        {/* Visualization Panel (Left) - REPLACE THIS ENTIRE SECTION */}
        <div className="visualization-panel">
          <h2>Visualization</h2>
          <VisualizationCanvas visualizationData={currentVisualization} />
        </div>

        {/* Chat Panel (Right) */}
        <div className="chat-panel">
          <h2>Chat History</h2>
          <div className="chat-messages">
            {messages.length === 0 ? (
              <p className="empty-state">No messages yet. Ask your first question!</p>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.type}`}>
                    <div className="message-content">{msg.content}</div>
                    <div className="message-time">{msg.timestamp}</div>
                  </div>
                ))}
                {isTyping && (
                  <div className="message answer">
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="question-form">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question (e.g., Explain Newton's First Law of Motion)"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Ask'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;