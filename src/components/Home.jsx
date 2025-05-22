import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [chat, setChat] = useState([
    { sender: 'alfred', text: 'What can I help you with today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    const updatedChat = [...chat, userMessage];
    setChat(updatedChat);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/alfred-home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageHistory: chat
            .map((msg) => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text,
            }))
            .concat({ role: 'user', content: input }),
        }),
      });

      const data = await response.json();
      const alfredReply = data.reply || "Got it! You can try one of the modules below or ask me more.";

      setChat((prev) => [...prev, { sender: 'alfred', text: alfredReply }]);
    } catch (err) {
      console.error('Error fetching Alfred response:', err);
      setChat((prev) => [
        ...prev,
        {
          sender: 'alfred',
          text: "Sorry, something went wrong. Try again or pick one of the modules below.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    width: '250px',
    height: '140px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '19px',
    cursor: 'pointer',
    textAlign: 'center',
    padding: '20px',
    wordBreak: 'break-word',
    fontFamily: 'Helvetica Neue, sans-serif',
  };

  const topCardsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '32px 48px',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '60px auto 40px',
    width: 'fit-content',
  };

  const titleStyle = {
    textAlign: 'center',
    fontSize: '36px',
    fontWeight: 'bold',
    marginTop: '40px',
    fontFamily: 'Helvetica Neue, sans-serif',
  };

  const subtitleStyle = {
    textAlign: 'center',
    fontSize: '18px',
    fontStyle: 'italic',
    color: '#555',
    marginTop: '12px',
    marginBottom: '40px',
    fontFamily: 'Helvetica Neue, sans-serif',
  };

  const chatContainer = {
    maxWidth: '600px',
    margin: '0 auto 60px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  const bubbleStyle = {
    padding: '12px 16px',
    borderRadius: '16px',
    maxWidth: '80%',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.5',
    fontSize: '15px',
  };

  const alfredBubble = {
    ...bubbleStyle,
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  };

  const userBubble = {
    ...bubbleStyle,
    backgroundColor: '#e0f0ff',
    alignSelf: 'flex-end',
  };

  const inputBox = {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #ccc',
    fontSize: '16px',
    marginTop: '12px',
  };

  const buttonStyle = {
    backgroundColor: '#FFD700',
    color: '#000',
    padding: '12px 20px',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    marginTop: '10px',
    alignSelf: 'flex-end',
  };

  const suggestionStyle = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '12px',
  };

  const suggestionButton = {
    padding: '8px 16px',
    borderRadius: '12px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
  };

  return (
    <div>
      <h1 style={titleStyle}>
        <span className="title-underline">Welcome to Alfred — Your AI Sales Partner</span>
      </h1>
      <p style={subtitleStyle}>
        Think of me as your assistant, analyst, and strategist — all rolled into one.
        <br />
        Select a module below, or tell me what you’re trying to accomplish.
      </p>

      <div style={topCardsContainerStyle}>
        <div className="card" style={cardStyle} onClick={() => navigate('/industry')}>
          🧠 Industry Research
          <br />
          <span style={{ fontSize: '16px', fontWeight: 'normal' }}>
            Quickly learn everything you need about an industry to stay current & build credibility.
          </span>
        </div>
        <div className="card" style={cardStyle} onClick={() => navigate('/build-campaign')}>
          🛠️ Prospecting Campaigns
          <br />
          <span style={{ fontSize: '16px', fontWeight: 'normal' }}>
            Craft high-converting outbound campaigns across multiple channels.
          </span>
        </div>
        <div className="card" style={cardStyle} onClick={() => navigate('/prep')}>
          📋 Meeting Preparation
          <br />
          <span style={{ fontSize: '16px', fontWeight: 'normal' }}>
            Save time preparing while maximizing every client-facing opportunity.
          </span>
        </div>
        <div className="card" style={cardStyle} onClick={() => navigate('/post-call')}>
          📝 Meeting Follow Up
          <br />
          <span style={{ fontSize: '16px', fontWeight: 'normal' }}>
            Make sure you have all your ducks in a row to keep moving fast after the meeting.
          </span>
        </div>
      </div>

      {/* 💬 Alfred Chat Section */}
      <div style={chatContainer}>
        {chat.map((msg, idx) => (
          <div key={idx} style={msg.sender === 'user' ? userBubble : alfredBubble}>
            <strong>{msg.sender === 'user' ? 'You' : '🧤 Alfred'}:</strong><br />
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={alfredBubble}>
            <strong>🧤 Alfred:</strong><br />
            typing...
          </div>
        )}
        <div ref={chatEndRef} />
        <input
          style={inputBox}
          value={input}
          placeholder="e.g., I want to prepare for a call with a dentist in Texas"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button style={buttonStyle} onClick={handleSend}>Ask Alfred</button>

        <div style={suggestionStyle}>
          <button style={suggestionButton} onClick={() => navigate('/industry')}>🧠 Industry Research</button>
          <button style={suggestionButton} onClick={() => navigate('/build-campaign')}>📢 Prospecting Campaigns</button>
          <button style={suggestionButton} onClick={() => navigate('/prep')}>📞 Meeting Preparation</button>
          <button style={suggestionButton} onClick={() => navigate('/post-call')}>📝 Meeting Follow-Up</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
