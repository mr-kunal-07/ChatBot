import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://chatbotbackend1-wulm.onrender.com/chat' || 'http://localhost:8000/chat' || 'https://chatbot-07iz.onrender.com/chat'; 

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const { data } = await axios.post(API_URL, { message: trimmed });
      const botMsg = { role: 'bot', content: data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'bot', content: 'Something went wrong. Try again.' }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header"><h1>Gemini Chat</h1></header>

      <div className="chat-box">
        {messages.length === 0 ? (
          <div className="empty-chat"><p>Start chatting with Gemini AI!</p></div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? 'user-msg' : 'bot-msg'}>
              <div className="message-bubble">
                <strong>{msg.role === 'user' ? 'You' : 'Gemini'}:</strong>
                <p>{msg.content}</p>
              </div>
            </div>
          ))
        )}

        {isSending && (
          <div className="bot-msg">
            <div className="message-bubble loading">
              <div className="typing-indicator"><span /><span /><span /></div>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          disabled={isSending}
          aria-label="Chat input"
        />
        <button onClick={sendMessage} disabled={isSending || !input.trim()} type="submit">
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default App;
