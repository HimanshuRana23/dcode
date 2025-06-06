import React, { useState, useRef, useEffect } from 'react';
import './FactoryIntelligence.css';
import { FaTrash, FaBars, FaTimes } from 'react-icons/fa';

const API_URL = 'http://localhost/backend/api';

const FactoryIntelligence = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await fetch(`${API_URL}/sessions.php`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const sessionsArray = Array.isArray(data) ? data : [];
      setSessions(sessionsArray);
      if (!sessionId && sessionsArray.length > 0) {
        setSessionId(sessionsArray[0].session_id);
        loadMessages(sessionsArray[0].session_id);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    }
  };

  const loadMessages = async (sid) => {
    try {
      const response = await fetch(`${API_URL}/messages.php?sessionId=${sid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await fetch(`${API_URL}/sessions.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1,
          title: newSessionTitle || 'New Chat',
        }),
      });
      const data = await response.json();
      setSessionId(data.sessionId);
      setNewSessionTitle('');
      setIsNewSessionModalOpen(false);
      loadSessions();
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleSessionClick = (sid) => {
    setSessionId(sid);
    loadMessages(sid);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveMessage = async (content, type) => {
    try {
      const response = await fetch(`${API_URL}/messages.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          content,
          type,
        }),
      });
      const data = await response.json();
      return data.messageId;
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;
    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    await saveMessage(inputMessage, 'user');
    const botResponse = getBotResponse(inputMessage);
    await saveMessage(botResponse, 'bot');
    const botMessage = {
      type: 'bot',
      content: botResponse,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! How can I assist you with factory operations today?';
    }
    if (lowerMessage.includes('production')) {
      return 'I can help you with production metrics, efficiency analysis, and optimization suggestions. What specific aspect would you like to know about?';
    }
    if (lowerMessage.includes('quality')) {
      return 'I can provide quality control metrics, defect analysis, and quality improvement recommendations. What would you like to know?';
    }
    if (lowerMessage.includes('maintenance')) {
      return 'I can help with maintenance schedules, equipment status, and predictive maintenance insights. What information do you need?';
    }
    if (lowerMessage.includes('efficiency')) {
      return 'I can analyze production efficiency, identify bottlenecks, and suggest improvements. What area would you like to focus on?';
    }
    return "I'm here to help with factory operations, production metrics, quality control, and maintenance. Could you please be more specific about what you'd like to know?";
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const deleteSession = async (sid) => {
    if (!window.confirm('Are you sure you want to delete this chat session?')) return;
    try {
      const response = await fetch(`${API_URL}/sessions.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: sid }),
      });
      if (!response.ok) throw new Error('Failed to delete session');
      // If the deleted session is selected, select another
      setSessions((prev) => prev.filter((s) => s.session_id !== sid));
      if (sessionId === sid) {
        const remaining = sessions.filter((s) => s.session_id !== sid);
        if (remaining.length > 0) {
          setSessionId(remaining[0].session_id);
          loadMessages(remaining[0].session_id);
        } else {
          setSessionId(null);
          setMessages([]);
        }
      }
      loadSessions();
    } catch (error) {
      alert('Error deleting session: ' + error.message);
    }
  };

  // Close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 600) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="factory-intelligence">
      {/* Mobile sidebar toggle button */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setIsSidebarOpen((open) => !open)}
      >
        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      <div
        className={`sessions-sidebar${isSidebarOpen ? ' open' : ''}`}
        onClick={() => window.innerWidth <= 600 && setIsSidebarOpen(false)}
      >
        <div className="sessions-header" onClick={e => e.stopPropagation()}>
          <h3>My Chat</h3>
          <button
            className="new-session-btn"
            onClick={e => { e.stopPropagation(); setIsNewSessionModalOpen(true); }}
          >
            New Chat
          </button>
        </div>
        <div className="sessions-list" onClick={e => e.stopPropagation()}>
          {Array.isArray(sessions) && sessions.map((session) => (
            <div
              key={session.session_id}
              className={`session-item ${session.session_id === sessionId ? 'active' : ''}`}
              onClick={() => handleSessionClick(session.session_id)}
            >
              <div className="session-info-col">
                <div className="session-title">{session.title}</div>
                {session.last_message && (
                  <div className="session-preview">
                    {session.last_message.substring(0, 50)}...
                  </div>
                )}
              </div>
              <button
                className="delete-session-btn"
                title="Delete session"
                onClick={e => { e.stopPropagation(); deleteSession(session.session_id); }}
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="chatgpt-chat-root">
        <div className="chatgpt-chat-center">
          <div className="chatgpt-message-row">
            <div className="chatgpt-avatar">😊</div>
            <div className="chatgpt-message-bubble">
              {messages.length === 0
                ? (<><b>Hello!</b> <br />How can I help you today?</>)
                : null}
            </div>
          </div>
          <div className="messages-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  {message.type === 'bot' && (
                    <div className="bot-avatar">
                      <span>🤖</span>
                    </div>
                  )}
                  <div className="message-bubble">
                    <p>{message.content}</p>
                    <span className="message-timestamp">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot-message">
                <div className="message-content">
                  <div className="bot-avatar">
                    <span>🤖</span>
                  </div>
                  <div className="message-bubble typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="chatgpt-input-row">
          <input
            type="text"
            className="chatgpt-input"
            placeholder="Ask anything"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            disabled={isTyping}
          />
          <button
            className="chatgpt-send-btn"
            onClick={handleSendMessage}
            disabled={isTyping || !inputMessage.trim()}
          >
            Send
          </button>
        </div>
        {isNewSessionModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Create New Chat Session</h3>
              <input
                type="text"
                value={newSessionTitle}
                onChange={e => setNewSessionTitle(e.target.value)}
                placeholder="Enter session title..."
              />
              <div className="modal-buttons">
                <button onClick={() => setIsNewSessionModalOpen(false)}>Cancel</button>
                <button onClick={createNewSession}>Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FactoryIntelligence;
