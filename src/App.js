import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);

  useEffect(() => {
    socket.on('chat message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off('chat message');
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && username.trim()) {
      socket.emit('chat message', { user: username, text: message });
      setMessage('');
    }
  };

  return (
    <div className="app">
      {!username ? (
        <div className="username-screen">
          <h2>Enter your name to join the chat</h2>
          <input
            type="text"
            placeholder="Your name..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') setUsername(e.target.value.trim());
            }}
          />
        </div>
      ) : (
        <div className="chat-container">
          <header>
            <h2>Welcome, {username} 👋</h2>
          </header>

          <div className="messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.user === username ? 'own' : ''}`}
              >
                <strong>{msg.user}:</strong> <span>{msg.text}</span>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          <form onSubmit={sendMessage} className="message-form">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
